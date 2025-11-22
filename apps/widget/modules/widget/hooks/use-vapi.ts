import Vapi from '@vapi-ai/web';
import { useEffect, useState } from 'react';

interface TranscriptMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // 初始化VAPI实例，使用环境变量中的密钥
    // 在实际使用中，这个密钥应该从Convex获取
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || '';
    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);
    vapiInstance.on('call-start', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setTranscript([]);
    });

    vapiInstance.on('call-end', () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      setIsSpeaking(false);
    });

    vapiInstance.on('error', (error) => {
      console.error('VAPI error:', error);
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === 'user' ? 'user' : 'assistant',
            text: message.transcript,
          },
        ]);
      }
    });
    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const startCall = () => {
    setIsConnecting(true);
    if (vapi) {
      // 使用默认配置开始通话
      vapi.start('');
    }
  };
  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};
