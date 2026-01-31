import { StatusBar } from 'expo-status-bar';
import { Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { styled } from 'nativewind';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Copy, Sparkles, RefreshCw } from 'lucide-react-native';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledInput = styled(TextInput);
const StyledButton = styled(TouchableOpacity);

const TONES = [
  { id: "negotiator", label: "Professional Negotiator", icon: "💼" },
  { id: "professional_casual", label: "Professional Casual", icon: "👔" },
  { id: "business", label: "Business", icon: "📊" },
  { id: "casual", label: "Casual Conversation", icon: "🙂" },
  { id: "witty", label: "Witty Conversation", icon: "⚡" },
  { id: "flirty", label: "Flirty Conversation", icon: "😉" },
  { id: "seductive", label: "Seductive Format", icon: "💋" },
];

export default function App() {
  const [inputText, setInputText] = useState("");
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    // NOTE: In a real mobile app, you would hit your deployed web API or an Edge function.
    // For demo purposes, we will mock or hit a local IP if configured.
    if (!inputText) return;
    setLoading(true);

    // Simulation for now since we don't have the backend URL exposed yet
    setTimeout(() => {
      setResponse(`[${selectedTone.label}]: This is a simulated high-quality response to "${inputText}". (Connect to API for live AI)`);
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      <StyledView className="flex-1 p-6 pt-12">

        {/* Header */}
        <StyledView className="flex-row items-center mb-8 gap-3">
          <StyledView className="w-10 h-10 rounded-xl bg-violet-600 items-center justify-center">
            <Sparkles size={20} color="white" />
          </StyledView>
          <StyledText className="text-2xl font-bold text-white">AI Keyboard</StyledText>
        </StyledView>

        {/* Input */}
        <StyledView className="mb-6 space-y-2">
          <StyledText className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1">Input Message</StyledText>
          <StyledView className="bg-gray-900 border border-gray-800 rounded-2xl p-4 min-h-[120px]">
            <StyledInput
              className="text-white text-base"
              multiline
              numberOfLines={4}
              placeholder="Type your message..."
              placeholderTextColor="#666"
              value={inputText}
              onChangeText={setInputText}
              style={{ textAlignVertical: 'top' }}
            />
          </StyledView>
        </StyledView>

        {/* Tone Selector */}
        <StyledView className="mb-6 flex-1">
          <StyledText className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1 mb-2">Select Persona</StyledText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-[120px]">
            <StyledView className="flex-row gap-3">
              {TONES.map(tone => (
                <StyledButton
                  key={tone.id}
                  onPress={() => setSelectedTone(tone)}
                  className={`p-4 rounded-xl border w-[120px] h-[100px] justify-between ${selectedTone.id === tone.id ? 'bg-gray-800 border-violet-500' : 'bg-gray-900 border-gray-800'}`}
                >
                  <StyledText className="text-3xl">{tone.icon}</StyledText>
                  <StyledText className={`text-xs font-medium ${selectedTone.id === tone.id ? 'text-white' : 'text-gray-400'}`}>
                    {tone.label}
                  </StyledText>
                </StyledButton>
              ))}
            </StyledView>
          </ScrollView>
        </StyledView>

        {/* Response Area */}
        {response ? (
          <StyledView className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 mb-4">
            <StyledView className="flex-row justify-between mb-2">
              <StyledText className="text-violet-400 text-xs font-bold flex-row items-center">
                AI SUGGESTION
              </StyledText>
              <Copy size={16} color="#9ca3af" />
            </StyledView>
            <StyledText className="text-white text-sm leading-6">
              {response}
            </StyledText>
          </StyledView>
        ) : null}

        {/* Generate Button */}
        <StyledButton
          className="h-14 bg-violet-600 rounded-2xl flex-row items-center justify-center shadow-lg shadow-violet-900/20 mt-auto"
          onPress={handleGenerate}
        >
          {loading ? (
            <StyledText className="text-white font-bold text-lg">Generating...</StyledText>
          ) : (
            <>
              <Sparkles size={20} color="white" className="mr-2" />
              <StyledText className="text-white font-bold text-lg ml-2">Generate Response</StyledText>
            </>
          )}
        </StyledButton>

      </StyledView>
    </SafeAreaView>
  );
}
