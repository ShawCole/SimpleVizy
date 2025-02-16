import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Save, Plus, X, ChevronDown } from 'lucide-react';

type NoteType = 'keyword' | 'premade' | 'custom';

interface FilterNotesProps {
  initialTitle?: string;
}

export default function FilterNotes({ initialTitle = "Edit Title" }: FilterNotesProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isKeywordsHovered, setIsKeywordsHovered] = useState(false);
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>('keyword');
  const [customText, setCustomText] = useState('');
  const [premadeText, setPremadeText] = useState('');
  
  const keywordInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingTitle(false);
  };

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 0);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
  };

  const handleKeywordClick = () => {
    setShowKeywordInput(true);
    setIsKeywordsHovered(false);
    setTimeout(() => {
      keywordInputRef.current?.focus();
    }, 0);
  };

  const addKeywords = (input: string) => {
    const newKeywords = input
      .split(',')
      .map(k => k.trim())
      .filter(k => k && !keywords.includes(k));

    if (newKeywords.length > 0) {
      setKeywords([...keywords, ...newKeywords]);
      setKeywordInput('');
      setShowKeywordInput(false);
    }
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeywords(keywordInput);
    } else if (e.key === 'Escape') {
      setShowKeywordInput(false);
      setKeywordInput('');
    }
  };

  const handleKeywordInputBlur = () => {
    if (keywordInput.trim()) {
      addKeywords(keywordInput);
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
    setHoveredKeyword(null);
  };

  const handleNoteTypeSelect = (type: NoteType) => {
    setNoteType(type);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (keywordInputRef.current && !keywordInputRef.current.contains(event.target as Node)) {
        if (keywordInput.trim()) {
          addKeywords(keywordInput);
        } else {
          setShowKeywordInput(false);
          setKeywordInput('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [keywordInput, keywords]);

  const renderNoteContent = () => {
    switch (noteType) {
      case 'keyword':
        return (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <div 
                className="inline-flex items-center px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                onMouseEnter={() => setIsKeywordsHovered(true)}
                onMouseLeave={() => setIsKeywordsHovered(false)}
                onClick={handleKeywordClick}
                style={{
                  backgroundColor: isKeywordsHovered ? '#2563EB' : 'transparent',
                }}
              >
                <span 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isKeywordsHovered ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {isKeywordsHovered ? 'Add Keywords' : 'Keywords:'}
                </span>
                {isKeywordsHovered && (
                  <Plus className="w-4 h-4 ml-1.5 text-white" />
                )}
              </div>

              {showKeywordInput && (
                <input
                  ref={keywordInputRef}
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordInputKeyDown}
                  onBlur={handleKeywordInputBlur}
                  className="w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type keywords, separate with commas"
                />
              )}
            </div>

            {keywords.map((keyword, index) => (
              <div
                key={index}
                className="relative inline-flex items-center"
                onMouseEnter={() => setHoveredKeyword(keyword)}
                onMouseLeave={() => setHoveredKeyword(null)}
              >
                <div 
                  className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full transition-all duration-200"
                  style={{
                    paddingRight: hoveredKeyword === keyword ? '28px' : '12px'
                  }}
                >
                  <span className="text-sm whitespace-nowrap">{keyword}</span>
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-blue-100 rounded-full transition-opacity duration-200 ${
                      hoveredKeyword === keyword 
                        ? 'opacity-100' 
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'premade':
        return (
          <textarea
            value={premadeText}
            onChange={(e) => setPremadeText(e.target.value)}
            className="w-full h-32 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your premade note text here..."
          />
        );
      case 'custom':
        return (
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="w-full h-32 px-4 py-3 text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your custom note text here..."
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex-1">
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl font-semibold"
                placeholder="Enter title"
              />
            </form>
          ) : (
            <h3 
              className="text-2xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={handleTitleClick}
            >
              {title}
            </h3>
          )}
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-5 h-5" />
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                <button
                  onClick={() => handleNoteTypeSelect('keyword')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                    noteType === 'keyword' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  Keyword
                </button>
                <button
                  onClick={() => handleNoteTypeSelect('premade')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                    noteType === 'premade' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  Premade
                </button>
                <button
                  onClick={() => handleNoteTypeSelect('custom')}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                    noteType === 'custom' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                  }`}
                >
                  Custom
                </button>
              </div>
            )}
          </div>
        </div>
        {renderNoteContent()}
      </div>
    </div>
  );
}