
# IOS KEYBOARD INTEGRATION INSTRUCTIONS

To complete the Keyboard setup, you MUST open the project in Xcode and add the target. 
Since I cannot click buttons in Xcode, follow these exact steps:

1. Open the project in Xcode:
   `npx cap open ios`

2. **Add a New Target**:
   - In Xcode, go to **File > New > Target...**
   - Search for **"Custom Keyboard Extension"**.
   - Click **Next**.
   - Name it: `KeyboardExtension`.
   - Ensure Language is **Swift**.
   - Click **Finish**. (If asked to "Activate" scheme, click Activate).

3. **Import the Code**:
   - I have already prepared the Swift code for you in: `ios/App/KeyboardExtension/`
   - In Xcode, find the new `KeyboardExtension` folder that Xcode created (in the left file navigator). 
   - **Delete** the default `KeyboardViewController.swift` that Xcode created.
   - **Drag and Drop** the `KeyboardViewController.swift` I created (from `ios/App/KeyboardExtension/`) into that group in Xcode.
   - Ensure "Copy items if needed" is checked.

4. **Verify Info.plist**:
   - In Xcode, click on the `Info.plist` inside the `KeyboardExtension` group.
   - Ensure `RequestsOpenAccess` is set to `YES` (I put this in the file I made, but Xcode creates its own default one, so update it).
   
5. **Set Permissions**:
   - The user must explicitly enable "Full Access" in iOS Settings > Keyboards for the AI to work (network requests are blocked otherwise).
   - Add a usage descriptionstring for "NSSpeechRecognitionUsageDescription" or similar in the main app's info.plist if you plan to use voice, but for text, the standard "Full Access" toggle handles permissions.

6. **Run**:
   - Select the `KeyboardExtension` scheme in the top bar.
   - Choose a simulator (e.g. iPhone 15).
   - Click Run.
   - When asked "Which app to run?", choose **MobileSafari** or **Messages**.
   - In the Simulator, click on a text field, long-press the Globe icon, and select "AI Keyboard".

7. **Deploying**:
   - To make this real, you need an Apple Developer Account ($99/yr) to sign and upload to the App Store.
