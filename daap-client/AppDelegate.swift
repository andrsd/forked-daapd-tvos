//
//  AppDelegate.swift
//  daap-client
//
//  Created by David Andrs on 4/11/20.
//  Copyright © 2020 David Andrs. All rights reserved.
//

import UIKit
import TVMLKit
import GCDWebServers
import AVFoundation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {

    var window: UIWindow?
    var appController: TVApplicationController?
    var webServer: GCDWebServer?

    var tvBaseURL: URL?
    var tvBootURL: URL?

    // MARK: Javascript Execution Helper

    func executeRemoteMethod(_ methodName: String, completion: @escaping (Bool) -> Void) {
        appController?.evaluate(inJavaScriptContext: { (context: JSContext) in
            let appObject : JSValue = context.objectForKeyedSubscript("App")

            if appObject.hasProperty(methodName) {
                appObject.invokeMethod(methodName, withArguments: [])
            }
            }, completion: completion)
    }

    // MARK: UIApplicationDelegate

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        initWebServer()

        // Override point for customization after application launch.
        window = UIWindow(frame: UIScreen.main.bounds)

        // Create the TVApplicationControllerContext for this application and set the properties that will be passed to the `App.onLaunch` function in JavaScript.
        let appControllerContext = TVApplicationControllerContext()

        // The JavaScript URL is used to create the JavaScript context for your TVMLKit application. Although it is possible to separate your JavaScript into separate files, to help reduce the launch time of your application we recommend creating minified and compressed version of this resource. This will allow for the resource to be retrieved and UI presented to the user quickly.
        appControllerContext.javaScriptApplicationURL = tvBootURL!

        appControllerContext.launchOptions["BASEURL"] = tvBaseURL!.absoluteString as NSString

        if let launchOptions = launchOptions {
            for (kind, value) in launchOptions {
                appControllerContext.launchOptions[kind.rawValue] = value
            }
        }

        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)

        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.playback, mode: .moviePlayback)
        }
        catch {
            print("Setting category to AVAudioSessionCategoryPlayback failed.")
        }

        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and stop playback
        executeRemoteMethod("onWillResignActive", completion: { (success: Bool) in
            // ...
        })
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        executeRemoteMethod("onDidEnterBackground", completion: { (success: Bool) in
            // ...
        })
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
        executeRemoteMethod("onWillEnterForeground", completion: { (success: Bool) in
            // ...
        })
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
        executeRemoteMethod("onDidBecomeActive", completion: { (success: Bool) in
            // ...
        })
    }

    // MARK: TVApplicationControllerDelegate

    func appController(_ appController: TVApplicationController, didFinishLaunching options: [String: Any]?) {
        print("\(#function) invoked with options: \(options ?? [:])")
    }

    func appController(_ appController: TVApplicationController, didFail error: Error) {
        print("\(#function) invoked with error: \(error)")

        let title = "Error Launching Application"
        let message = error.localizedDescription
        let alertController = UIAlertController(title: title, message: message, preferredStyle:.alert )

        self.appController?.navigationController.present(alertController, animated: true, completion: {
            // ...
        })
    }

    func appController(_ appController: TVApplicationController, didStop options: [String: Any]?) {
        print("\(#function) invoked with options: \(options ?? [:])")
    }

    func initWebServer() {
        webServer = GCDWebServer()

        let mainBundle = Bundle.main
        let folderPath = mainBundle.path(forResource: "dist", ofType: nil) ?? ""

        webServer!.addGETHandler(
            forBasePath: "/",
            directoryPath: folderPath,
            indexFilename: "",
            cacheAge: 3600,
            allowRangeRequests: true)

        webServer!.start(
            withPort: 9011,
            bonjourName: nil)
        
        tvBaseURL = webServer!.serverURL ?? URL(string: "localhost")
        tvBootURL = URL(string: "/app.js", relativeTo: tvBaseURL)
    }
}
