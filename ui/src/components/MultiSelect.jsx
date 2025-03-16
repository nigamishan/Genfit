import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const MultiSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  min-height: 45px;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  cursor: text;
  
  &:focus-within {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const Tag = styled.span`
  background: #e0e0e0;
  border-radius: 3px;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  color: #666;
  
  &:hover {
    color: #dc3545;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  padding: 0;
  flex: 1;
  min-width: 50px;
  font-size: 1rem;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Option = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
  
  ${props => props.selected && `
    background: #e3f2fd;
    &:hover {
      background: #bbdefb;
    }
  `}
`;

const MultiSelect = ({ options, value, onChange, placeholder = 'Type to search...' }) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(option.value)
  );
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue.length >= 3) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  
  const handleSelect = (optionValue) => {
    onChange([...value, optionValue]);
    setInputValue('');
    setIsOpen(false);
  };
  
  const handleRemove = (optionValue) => {
    onChange(value.filter(v => v !== optionValue));
  };
  
  const selectedOptions = options.filter(option => value.includes(option.value));
  
  return (
    <MultiSelectContainer ref={containerRef}>
      <InputContainer onClick={() => document.querySelector('input').focus()}>
        {selectedOptions.map(option => (
          <Tag key={option.value}>
            {option.label}
            <RemoveTag onClick={() => handleRemove(option.value)}>&times;</RemoveTag>
          </Tag>
        ))}
        <Input
          value={inputValue}
          onChange={handleInputChange}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
        />
      </InputContainer>
      
      {isOpen && filteredOptions.length > 0 && (
        <Dropdown>
          {filteredOptions.map(option => (
            <Option
              key={option.value}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </MultiSelectContainer>
  );
};

export default MultiSelect;