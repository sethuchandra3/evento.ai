import React, { useState, useRef } from 'react';
import { sendMessageToLambda, LambdaResponse } from './MessageHandler';
import SparkleIcon from './icons/SparkleIcon';
import LoaderIcon from './icons/LoaderIcon';
import { useOnScreen } from '../App';

const ApiTest: React.FC = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<LambdaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(sectionRef, { threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const data = await sendMessageToLambda(message);
      setResponse(data);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="try-it" className="py-20 sm:py-24 px-6 md:px-8" ref={sectionRef}>
      <div className="container mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          Try It Live
        </h2>
        <p className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          See how Evento.ai extracts event details from a simple message.
        </p>

        <div className={`max-w-3xl mx-auto bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}>
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste a message here, e.g., 'Study session at the library tomorrow at 7pm?'"
              className="w-full h-32 bg-black/20 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition resize-none"
              disabled={isLoading}
              aria-label="Message to analyze"
            />
            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="mt-6 w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-cyan-400 text-black font-bold rounded-xl shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:bg-cyan-300 hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="w-6 h-6" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <SparkleIcon className="w-6 h-6" />
                  <span>Analyze Message</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 text-left p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-8 text-left">
              <h3 className="text-2xl font-bold mb-4 text-white">AI Analysis Result:</h3>
              <div className="bg-black/30 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-200"><code>{JSON.stringify(response, null, 2)}</code></pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApiTest;