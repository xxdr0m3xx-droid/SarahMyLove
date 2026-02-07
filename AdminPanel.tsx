
import React, { useState, useRef } from 'react';
import { ContentItem, ContentType } from '../types';
import { enhancePoem, generateAcrosticPoem } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

interface AdminPanelProps {
  onAddContent: (item: ContentItem) => void;
  onLogout: () => void;
  content: ContentItem[];
  onDelete: (id: string) => void;
}

// Fixed: Removed conflicting 'aistudio' declaration. Relying on environment-provided types and safety assertions.
export const AdminPanel: React.FC<AdminPanelProps> = ({ onAddContent, onLogout, content, onDelete }) => {
  const [activeTab, setActiveTab] = useState<ContentType>('photo');
  const [title, setTitle] = useState('');
  const [textBody, setTextBody] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAddContent({
          id: Date.now().toString(),
          type: 'photo',
          title: title || 'A Special Moment',
          content: reader.result as string,
          timestamp: Date.now(),
        });
        setTitle('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAcrostic = async () => {
    if (!title) {
      alert("Please enter a title word (e.g., 'FOREVER') to generate an acrostic.");
      return;
    }
    setIsEnhancing(true);
    const poem = await generateAcrosticPoem(title);
    setTextBody(poem);
    setIsEnhancing(false);
  };

  const handleGenerateVideo = async () => {
    if (!textBody) return;
    
    // Fixed: Using type assertion to access pre-configured aistudio object safely
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }

    setVideoStatus('Initiating generation...');
    setIsGenerating(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A cinematic, romantic masterpiece: ${textBody}. Soft lighting, high quality, 1080p.`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      setVideoStatus('Generating your movie (this may take a minute)...');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        onAddContent({
          id: Date.now().toString(),
          type: 'video',
          title: title || 'A Cinematic Dream',
          content: fetchUrl,
          timestamp: Date.now(),
        });
        setTextBody('');
        setTitle('');
        setVideoStatus('Generation successful!');
      }
    } catch (e: any) {
      console.error(e);
      // Fixed: Handle API key selection reset if Requested entity was not found
      if (e.message?.includes("Requested entity was not found")) {
        alert("API Key error. Please select a valid paid project key.");
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Video generation failed. Please try again later.");
      }
    } finally {
      setIsGenerating(false);
      setVideoStatus('');
    }
  };

  const handleGeneratePostcard = async () => {
    if (!textBody) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A beautiful, highly aesthetic romantic postcard illustration about: ${textBody}. Style: Soft watercolor, pastel colors, dreamy atmosphere.` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      let imageData = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageData) {
        onAddContent({
          id: Date.now().toString(),
          type: 'postcard',
          title: title || 'A Dream for You',
          content: imageData,
          timestamp: Date.now(),
          metadata: { prompt: textBody }
        });
        setTextBody('');
        setTitle('');
      }
    } catch (e) {
      console.error(e);
      alert("AI Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">Sanctuary HQ</h1>
            <p className="text-slate-500 font-medium">Curating moments for June 18.</p>
          </div>
          <div className="flex gap-4">
            {/* Fixed: Access openSelectKey through cast window object */}
            <button onClick={() => (window as any).aistudio.openSelectKey()} className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-500/20">Switch Key</button>
            <button onClick={onLogout} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all font-bold text-xs uppercase">Lock Session</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="bg-slate-800/40 rounded-[2.5rem] p-8 border border-slate-800">
              <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-1 rounded-2xl overflow-x-auto">
                {(['photo', 'poem', 'voice', 'postcard', 'video'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[80px] py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={activeTab === 'poem' ? "Acrostic Word (e.g., LOVE)..." : "Title of this memory..."}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-pink-500/30 outline-none transition-all"
                />

                {activeTab === 'photo' && (
                  <>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full aspect-video border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center hover:bg-white/5 transition-all group">
                      <span className="text-slate-500 group-hover:text-pink-500 text-3xl mb-2">📸</span>
                      <span className="text-xs font-bold uppercase text-slate-500">Upload Photo</span>
                    </button>
                  </>
                )}

                {activeTab === 'video' && (
                  <div className="space-y-4">
                    <textarea
                      value={textBody}
                      onChange={(e) => setTextBody(e.target.value)}
                      placeholder="Describe the romantic cinematic scene (e.g., 'A couple dancing under a starry sky with bokeh lights')."
                      className="w-full h-40 bg-slate-900 border border-slate-700 rounded-3xl px-6 py-4 text-white resize-none"
                    />
                    <button 
                      onClick={handleGenerateVideo}
                      disabled={isGenerating || !textBody}
                      className="w-full py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                           <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>{videoStatus}</span>
                        </div>
                      ) : '🎬 Generate AI Movie (Veo)'}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center px-4">Generate 16:9 cinematic videos. Requires a paid API key via aistudio.</p>
                  </div>
                )}

                {activeTab === 'postcard' && (
                  <div className="space-y-4">
                    <textarea
                      value={textBody}
                      onChange={(e) => setTextBody(e.target.value)}
                      placeholder="Describe the aesthetic of the postcard..."
                      className="w-full h-40 bg-slate-900 border border-slate-700 rounded-3xl px-6 py-4 text-white resize-none"
                    />
                    <button onClick={handleGeneratePostcard} disabled={isGenerating || !textBody} className="w-full py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-30">
                      {isGenerating ? 'AI is painting...' : '✨ Generate AI Postcard'}
                    </button>
                  </div>
                )}

                {activeTab === 'poem' && (
                  <div className="space-y-4">
                    <textarea
                      value={textBody}
                      onChange={(e) => setTextBody(e.target.value)}
                      placeholder="Pour your heart out or generate from title above..."
                      className="w-full h-64 bg-slate-900 border border-slate-700 rounded-3xl px-6 py-6 text-white font-serif text-lg resize-none"
                    />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={handleCreateAcrostic} disabled={isEnhancing} className="flex-1 py-4 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-bold hover:bg-indigo-500/30 transition-all">
                        {isEnhancing ? 'Creating...' : 'Title Acrostic'}
                      </button>
                      <button onClick={() => {
                        const newItem: ContentItem = { id: Date.now().toString(), type: 'poem', title: title || 'A Note', content: textBody, timestamp: Date.now() };
                        onAddContent(newItem);
                        setTextBody('');
                        setTitle('');
                      }} className="flex-1 py-4 bg-pink-600 text-white rounded-2xl font-bold hover:bg-pink-700 transition-all">
                        Post Note
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'voice' && (
                  <div className="py-12 text-center">
                    <button
                      onClick={isRecording ? () => mediaRecorderRef.current?.stop() : async () => {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        const mediaRecorder = new MediaRecorder(stream);
                        mediaRecorderRef.current = mediaRecorder;
                        audioChunksRef.current = [];
                        mediaRecorder.ondataavailable = (event) => audioChunksRef.current.push(event.data);
                        mediaRecorder.onstop = () => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            onAddContent({ id: Date.now().toString(), type: 'voice', title: title || 'Voice Memo', content: reader.result as string, timestamp: Date.now() });
                            setTitle('');
                          };
                          reader.readAsDataURL(new Blob(audioChunksRef.current, { type: 'audio/wav' }));
                        };
                        mediaRecorder.start();
                        setIsRecording(true);
                      }}
                      className={`h-24 w-24 rounded-full flex items-center justify-center transition-all shadow-xl mx-auto mb-6 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-pink-600 hover:scale-105'}`}
                    >
                      <span className="text-white text-3xl">{isRecording ? '⏹' : '🎤'}</span>
                    </button>
                    <p className="text-xs font-bold uppercase text-slate-500">{isRecording ? 'Recording Heartbeats...' : 'Tap to Record'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Memory Bank ({content.length})</h2>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {content.map(item => (
                <div key={item.id} className="bg-slate-800/20 p-4 rounded-2xl border border-slate-800 group relative flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 shrink-0 flex items-center justify-center text-xl overflow-hidden">
                    {item.type === 'photo' || item.type === 'postcard' ? <img src={item.content} className="w-full h-full object-cover" /> : item.type === 'video' ? '🎬' : '✍'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-bold truncate text-sm">{item.title}</h4>
                    <span className="text-[9px] text-pink-500 font-black uppercase tracking-widest">{item.type}</span>
                  </div>
                  <button onClick={() => onDelete(item.id)} className="text-slate-600 hover:text-red-500 p-2">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </div>
  );
};
