//
//  KeyboardViewController.swift
//  KeyboardExtension
//
//  Created by AI Assistant on 2026/01/31.
//

import UIKit
import SwiftUI

// MARK: - API Client using Swift
struct AIResponse: Decodable {
    let response: String
}

class KeyboardViewModel: ObservableObject {
    @Published var inputText: String = ""
    @Published var generatedResponse: String = ""
    @Published var isLoading: Bool = false
    @Published var selectedTone: String = "Professional Negotiator"
    
    // Replace this with your actual deployed Next.js API URL
    // NOTE: Localhost (192.168...) might fail consistently in Extension sandbox due to ATS. 
    // Use an HTTPS tunnel or deployed URL.
    let apiURL = "https://your-deployed-app.vercel.app/api/generate" 
    
    // In a real app, you might want to proxy this request through the main app 
    // or ensure you have configured App Groups to share credentials.
    // For demo, we assume the API Key is handled on server or baked in (less secure).
    
    func generateResponse(proxy: UITextDocumentProxy) {
        // 1. Get context from cursor
        // Keyboards have limited access to text. They can read contextBeforeInput.
        let ctx = proxy.documentContextBeforeInput ?? ""
        
        let textToAnalyze = inputText.isEmpty ? ctx : inputText
        guard !textToAnalyze.isEmpty else {
            self.generatedResponse = "Type something or copy text first!"
            return
        }
        
        isLoading = true
        generatedResponse = ""
        
        // 2. Prepare Request
        guard let url = URL(string: apiURL) else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "text": textToAnalyze,
            "tone": selectedTone
        ]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        // 3. Send
        URLSession.shared.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error {
                    self.generatedResponse = "Error: \(error.localizedDescription)"
                    return
                }
                
                guard let data = data,
                      let result = try? JSONDecoder().decode(AIResponse.self, from: data) else {
                    self.generatedResponse = "Failed to parse response."
                    return
                }
                
                self.generatedResponse = result.response
            }
        }.resume()
    }
    
    func insertResponse(proxy: UITextDocumentProxy) {
        if !generatedResponse.isEmpty {
            proxy.insertText(generatedResponse)
        }
    }
}

// MARK: - SwiftUI View for Keyboard
struct KeyboardView: View {
    @StateObject var viewModel = KeyboardViewModel()
    var textProxy: UITextDocumentProxy
    var advanceToNextInputMode: (() -> Void)?
    
    let tones = [
        ("💼", "Negotiator"),
        ("😉", "Flirty"),
        ("⚡", "Witty"),
        ("👔", "Pro Casual"),
        ("💋", "Seductive")
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            // Top Bar: AI Controls
            HStack {
                Text("✨ AI Keyboard")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                Spacer()
                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                }
            }
            .padding(10)
            .background(Color(red: 0.1, green: 0.05, blue: 0.2)) // Dark Purple
            
            // Tone Selector
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(tones, id: \.1) { (icon, name) in
                        Button(action: {
                            viewModel.selectedTone = name
                        }) {
                            VStack {
                                Text(icon).font(.title2)
                                Text(name).font(.caption2).foregroundColor(.white)
                            }
                            .padding(8)
                            .background(viewModel.selectedTone == name ? Color.purple.opacity(0.6) : Color.white.opacity(0.1))
                            .cornerRadius(8)
                        }
                    }
                }
                .padding(.horizontal)
            }
            .frame(height: 60)
            .background(LinearGradient(colors: [Color.black, Color(red: 0.1, green: 0.1, blue: 0.2)], startPoint: .top, endPoint: .bottom))

            // Suggestion Area
            if !viewModel.generatedResponse.isEmpty {
                Button(action: {
                    viewModel.insertResponse(proxy: textProxy)
                }) {
                    Text(viewModel.generatedResponse)
                        .lineLimit(2)
                        .font(.system(size: 14))
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color.purple.opacity(0.3))
                        .cornerRadius(8)
                        .padding(8)
                }
            } else {
                 // Trigger Button
                Button(action: {
                     viewModel.generateResponse(proxy: textProxy)
                }) {
                    HStack {
                        Image(systemName: "sparkles")
                        Text("Analyze & Generate Response")
                    }
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.blue)
                    .cornerRadius(8)
                    .padding(8)
                }
            }
            
            // Next Keyboard / Globe
            HStack {
                Button(action: {
                    advanceToNextInputMode?()
                }) {
                    Image(systemName: "globe")
                        .foregroundColor(.gray)
                        .padding()
                }
                Spacer()
                Button(action: {
                    textProxy.deleteBackward()
                }) {
                    Image(systemName: "delete.left")
                        .foregroundColor(.gray)
                        .padding()
                }
            }
            .background(Color.black)
        }
        .background(Color.black)
    }
}


// MARK: - Controller
class KeyboardViewController: UIInputViewController {

    var host: UIHostingController<KeyboardView>?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let swiftUIView = KeyboardView(textProxy: self.textDocumentProxy) { [weak self] in
            self?.advanceToNextInputMode()
        }
        
        let host = UIHostingController(rootView: swiftUIView)
        addChild(host)
        view.addSubview(host.view)
        
        // Auto Layout
        host.view.translatesAutoresizingMaskIntoConstraints = false
        host.view.backgroundColor = .clear
        
        NSLayoutConstraint.activate([
            host.view.leftAnchor.constraint(equalTo: view.leftAnchor),
            host.view.rightAnchor.constraint(equalTo: view.rightAnchor),
            host.view.topAnchor.constraint(equalTo: view.topAnchor),
            host.view.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            host.view.heightAnchor.constraint(equalToConstant: 260) // Standard-ish keyboard height
        ])
        
        host.didMove(toParent: self)
        self.host = host
    }
    
    override func textWillChange(_ textInput: UITextInput?) {
        // The app is about to change the document's contents. Perform any preparation here.
    }

    override func textDidChange(_ textInput: UITextInput?) {
        // The app has just changed the document's contents, the document context has been updated.
    }
}
