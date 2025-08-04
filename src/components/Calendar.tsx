import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';

interface CalendarProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-gray-300" />
          <h3 className="text-white font-semibold">Schedule</h3>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPreviousMonth}
            className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-300" />
          </button>
          <button 
            onClick={goToNextMonth}
            className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xl font-bold text-white">
          {format(currentDate, 'MMMM, yyyy')}
        </h4>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-gray-400 text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const isCurrentDay = isToday(day);
          const isSelected = selectedDate === format(day, 'yyyy-MM-dd');
          return (
            <button
              key={index}
              onClick={() => onDateSelect?.(format(day, 'yyyy-MM-dd'))}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : isCurrentDay
                  ? 'bg-blue-400 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 