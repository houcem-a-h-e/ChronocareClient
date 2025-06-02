import React, { useContext, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import apiRequest from '../Api/apiRequest';
import flaskApi from '../Api/flaskApi';
import { AuthContext } from '../Context/AuthContext';
import { FaRobot, FaQuestion } from 'react-icons/fa6';

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const questions = {
   fr: [
      'Comment ça va ?',
      'Comment créer un compte ChronoCare ?',
      'Comment accéder à mon historique médical ?',
      'Comment télécharger mes ordonnances ?',
      'Comment modifier mes informations personnelles ?',
      'Que faire si j\'oublie mon mot de passe ?',
      'Comment supprimer définitivement mon compte ?'
    ],
    ar: [
      'كيف حالك؟',
      'كيف يمكنني إنشاء حساب في ChronoCare؟',
      'كيف يمكنني الوصول إلى سجلي الطبي؟',
      'كيف يمكنني تحميل وصفاتي الطبية؟',
      'كيف يمكنني تحديث معلوماتي الشخصية؟',
      'ماذا أفعل إذا نسيت كلمة المرور؟',
      'كيف يمكنني حذف حسابي نهائيًا؟'
    ]
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleQuestion = async (questionKey) => {
    setIsProcessing(true);
    try {
      const questionText = t(questionKey);
      
      // Add to asked questions temporarily
      setAskedQuestions(prev => new Set([...prev, questionKey]));

      // Updated API call to Flask endpoint
      const response = await flaskApi.post('/ask', { 
        question: questionText 
      });

      // Remove from asked questions after response
      setAskedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionKey);
        return newSet;
      });

      setMessages(prev => [
        ...prev,
        { text: questionText, isBot: false },
        { 
          text: response.data.answer, 
          isBot: true,
          meta: {
            confidence: `${Math.round(response.data.confidence * 100)}%`,
            matchedQuestion: response.data.matched_question,
            language: response.data.language
          }
        }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { text: t(questionKey), isBot: false },
        { 
          text: t('chatbot.errorResponse'), 
          isBot: true,
          isError: true
        }
      ]);
      setAskedQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionKey);
        return newSet;
      });
    }
    setIsProcessing(false);
  };

  // Updated MessageBubble with enhanced metadata display
  const MessageBubble = ({ msg }) => (
    <div className={`max-w-[80%] p-3 rounded-lg relative ${
      msg.isBot 
        ? msg.isError 
          ? 'bg-red-100 text-red-800' 
          : 'bg-gray-100 text-gray-800'
        : 'bg-sky-400 text-white'
    }`}>
      <div>{msg.text}</div>
      {/*msg.meta && (
        <div className="text-xs mt-1 opacity-70 flex flex-col">
          <span>🔍 Matched: {msg.meta.matchedQuestion}</span>
          <span>📊 Confidence: {msg.meta.confidence}</span>
          <span>🌐 Language: {msg.meta.language}</span>
        </div>
      )*/}
    </div>
  );

  // ... rest of your component remains the same ...
  return (
    <div className="fixed bottom-16 right-4 z-50">
      {isOpen ? (
        <div
          className={`w-80 bg-white rounded-lg shadow-xl border border-gray-200 ${selectedLanguage === 'ar' ? 'rtl' : 'ltr'}`}
          dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
          style={{
            maxHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-sky-400 text-white rounded-t-lg" style={{ flexBasis: '10%' }}>
            <h3 className="text-lg font-semibold">{t('chatbotTitle')}</h3>
            <button onClick={() => setIsOpen(false)} className="bg-red-600 hover:bg-red-700 p-1 rounded-full transition">
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Questions Section */}
          <div className="p-4 border-b overflow-y-auto" style={{ flexBasis: '40%' }}>
            {!selectedLanguage ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">{t('selectLanguage')}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {['fr', 'ar'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className="w-full p-2 text-sm rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 transition"
                    >
                      {t(`${lang}`)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-sm font-medium mb-2">{t('chooseQuestion')}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {questions[selectedLanguage]
                    .filter((q) => !askedQuestions.has(q))
                    .map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuestion(q)}
                        disabled={isProcessing}
                        className="w-full p-2 text-sm text-left rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                      >
                        {t(q)}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages Section */}
          <div className="overflow-y-auto p-4 space-y-4" style={{ flexBasis: '40%' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <MessageBubble msg={msg} />
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-16 h-16 rounded-full bg-sky-400 text-white shadow-lg hover:bg-sky-500 transition"
        >
          <FaRobot className="text-3xl" />
          <FaQuestion className="text-xs absolute bottom-2 right-2" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;