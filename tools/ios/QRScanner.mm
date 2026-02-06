#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>

#include "QRScanner.h"
#include <spdlog/spdlog.h>

// ---------------------------------------------------------------------------
// QR scanner view controller — full-screen camera preview with QR detection
// ---------------------------------------------------------------------------

@interface SQQRScannerVC : UIViewController <AVCaptureMetadataOutputObjectsDelegate>
@property (nonatomic, copy) void (^onURL)(NSString *);
@end

@implementation SQQRScannerVC {
    AVCaptureSession *_session;
    AVCaptureVideoPreviewLayer *_previewLayer;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor blackColor];

    AVCaptureDevice *device =
        [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if (!device) {
        SPDLOG_ERROR("No camera available");
        return;
    }

    NSError *error = nil;
    AVCaptureDeviceInput *input =
        [AVCaptureDeviceInput deviceInputWithDevice:device error:&error];
    if (!input) {
        SPDLOG_ERROR("Camera input error: {}",
                     [[error localizedDescription] UTF8String]);
        return;
    }

    _session = [[AVCaptureSession alloc] init];
    [_session addInput:input];

    AVCaptureMetadataOutput *output = [[AVCaptureMetadataOutput alloc] init];
    [_session addOutput:output];
    [output setMetadataObjectsDelegate:self queue:dispatch_get_main_queue()];
    output.metadataObjectTypes = @[ AVMetadataObjectTypeQRCode ];

    _previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:_session];
    _previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    [self.view.layer addSublayer:_previewLayer];

    // Instruction label
    UILabel *label = [[UILabel alloc] init];
    label.text = @"Scan QR Code";
    label.textColor = [UIColor whiteColor];
    label.font = [UIFont systemFontOfSize:22 weight:UIFontWeightMedium];
    label.textAlignment = NSTextAlignmentCenter;
    label.translatesAutoresizingMaskIntoConstraints = NO;
    [self.view addSubview:label];
    [NSLayoutConstraint activateConstraints:@[
        [label.topAnchor
            constraintEqualToAnchor:self.view.safeAreaLayoutGuide.topAnchor
                           constant:40],
        [label.centerXAnchor
            constraintEqualToAnchor:self.view.centerXAnchor],
    ]];

    [_session startRunning];
}

- (void)viewDidLayoutSubviews {
    [super viewDidLayoutSubviews];
    _previewLayer.frame = self.view.bounds;

    // Sync preview rotation with interface orientation
    AVCaptureConnection *connection = _previewLayer.connection;
    if (!connection) return;

    UIInterfaceOrientation orientation =
        self.view.window.windowScene.interfaceOrientation;

    if (@available(iOS 17.0, *)) {
        CGFloat angle;
        switch (orientation) {
        case UIInterfaceOrientationPortrait:           angle = 90;  break;
        case UIInterfaceOrientationPortraitUpsideDown: angle = 270; break;
        case UIInterfaceOrientationLandscapeRight:     angle = 0;   break;
        case UIInterfaceOrientationLandscapeLeft:      angle = 180; break;
        default:                                       angle = 90;  break;
        }
        if ([connection isVideoRotationAngleSupported:angle])
            connection.videoRotationAngle = angle;
    } else {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
        AVCaptureVideoOrientation vo;
        switch (orientation) {
        case UIInterfaceOrientationPortrait:
            vo = AVCaptureVideoOrientationPortrait; break;
        case UIInterfaceOrientationPortraitUpsideDown:
            vo = AVCaptureVideoOrientationPortraitUpsideDown; break;
        case UIInterfaceOrientationLandscapeRight:
            vo = AVCaptureVideoOrientationLandscapeRight; break;
        case UIInterfaceOrientationLandscapeLeft:
            vo = AVCaptureVideoOrientationLandscapeLeft; break;
        default:
            vo = AVCaptureVideoOrientationPortrait; break;
        }
        connection.videoOrientation = vo;
#pragma clang diagnostic pop
    }
}

- (void)captureOutput:(AVCaptureOutput *)output
    didOutputMetadataObjects:(NSArray<__kindof AVMetadataObject *> *)objects
              fromConnection:(AVCaptureConnection *)connection {
    for (AVMetadataObject *obj in objects) {
        if (![obj isKindOfClass:[AVMetadataMachineReadableCodeObject class]])
            continue;
        NSString *value =
            [(AVMetadataMachineReadableCodeObject *)obj stringValue];
        if ([value hasPrefix:@"squz-remote://"]) {
            [_session stopRunning];
            if (self.onURL) self.onURL(value);
            return;
        }
    }
}

@end

// ---------------------------------------------------------------------------
// C++ entry point
// ---------------------------------------------------------------------------

namespace sq {

ScanResult scanQRCode() {
    @autoreleasepool {
        // Request camera permission if undetermined
        AVAuthorizationStatus authStatus =
            [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];

        if (authStatus == AVAuthorizationStatusNotDetermined) {
            __block bool permissionAnswered = false;
            [AVCaptureDevice
                requestAccessForMediaType:AVMediaTypeVideo
                        completionHandler:^(BOOL) {
                            permissionAnswered = true;
                        }];
            while (!permissionAnswered) {
                @autoreleasepool {
                    CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.05, false);
                }
            }
            authStatus = [AVCaptureDevice
                authorizationStatusForMediaType:AVMediaTypeVideo];
        }

        if (authStatus != AVAuthorizationStatusAuthorized) {
            SPDLOG_ERROR("Camera access denied");
            return {};
        }

        // Present camera scanner
        __block NSString *scannedURL = nil;

        // Find the active window scene so the window is visible
        UIWindowScene *scene = nil;
        for (UIScene *s in UIApplication.sharedApplication.connectedScenes) {
            if ([s isKindOfClass:[UIWindowScene class]]) {
                scene = (UIWindowScene *)s;
                break;
            }
        }

        UIWindow *window;
        if (scene) {
            window = [[UIWindow alloc] initWithWindowScene:scene];
        } else {
            window = [[UIWindow alloc]
                initWithFrame:[[UIScreen mainScreen] bounds]];
        }

        SQQRScannerVC *vc = [[SQQRScannerVC alloc] init];

        vc.onURL = ^(NSString *url) {
            scannedURL = [url copy];
        };

        window.rootViewController = vc;
        [window makeKeyAndVisible];

        // Pump the run loop until a QR code is detected
        while (!scannedURL) {
            @autoreleasepool {
                CFRunLoopRunInMode(kCFRunLoopDefaultMode, 0.05, false);
            }
        }

        window.hidden = YES;

        // Parse squz-remote://host:port
        NSURL *parsed = [NSURL URLWithString:scannedURL];
        ScanResult result;
        if (parsed.host) {
            result.host = [parsed.host UTF8String];
        }
        if (parsed.port) {
            result.port =
                static_cast<uint16_t>([parsed.port unsignedShortValue]);
        }

        SPDLOG_INFO("Scanned: {}:{}", result.host, result.port);
        return result;
    }
}

} // namespace sq
