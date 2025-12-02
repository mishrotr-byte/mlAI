import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // npm install react-beautiful-dnd
import { Plus, User, Mail, Lock } from 'lucide-react';

const blocks = [
  { id: 'name', type: 'input', label: 'Имя', icon: User },
  { id: 'email', type: 'input', label: 'Email', icon: Mail },
  { id: 'password', type: 'password', label: 'Пароль', icon: Lock },
  { id: 'avatar', type: 'upload', label: 'Аватар', icon: Image },
  { id: 'submit', type: 'button', label: 'Зарегистрироваться' }
];

export default function RegistrationFlow({ onRegister }) {
  const [flow, setFlow] = useState(blocks);
  const [formData, setFormData] = useState({});

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newFlow = Array.from(flow);
    const [reordered] = newFlow.splice(result.source.index, 1);
    newFlow.splice(result.destination.index, 0, reordered);
    setFlow(newFlow);
  };

  const handleInput = (id, value) => setFormData({ ...formData, [id]: value });

  const submit = () => {
    fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })
      .then(res => res.json())
      .then(user => onRegister(user));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl mb-4">Собери свой флоу регистрации (как кубики в Botpress)</h2>
        <Droppable droppableId="flow">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 mb-4">
              {flow.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center p-2 bg-gray-700 rounded">
                      <block.icon size={20} className="mr-2" />
                      <input
                        type={block.type}
                        placeholder={block.label}
                        onChange={(e) => handleInput(block.id, e.target.value)}
                        className="flex-1 bg-transparent"
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button onClick={submit} className="w-full p-2 bg-blue-600 rounded">Сохранить флоу и зарегистрироваться</button>
      </div>
    </DragDropContext>
  );
}
