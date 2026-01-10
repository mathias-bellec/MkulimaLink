import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Plus, CheckCircle, Clock, AlertTriangle, Leaf } from 'lucide-react';
import { format, isToday, isPast, addDays } from 'date-fns';
import api from '../api/axios';
import toast from 'react-hot-toast';

function CropCalendar() {
  const queryClient = useQueryClient();
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: calendars, isLoading } = useQuery({
    queryKey: ['crop-calendars'],
    queryFn: async () => {
      const response = await api.get('/calendar');
      return response.data;
    }
  });

  const { data: calendarDetail } = useQuery({
    queryKey: ['crop-calendar', selectedCalendar],
    queryFn: async () => {
      const response = await api.get(`/calendar/${selectedCalendar}`);
      return response.data;
    },
    enabled: !!selectedCalendar
  });

  const completeTaskMutation = useMutation({
    mutationFn: async ({ calendarId, taskId }) => {
      await api.put(`/calendar/${calendarId}/tasks/${taskId}`, { status: 'completed' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['crop-calendar', selectedCalendar]);
      toast.success('Task completed!');
    }
  });

  const getTaskIcon = (type) => {
    const icons = {
      planting: '🌱',
      fertilizing: '🧪',
      watering: '💧',
      weeding: '🌿',
      pest_control: '🔬',
      harvesting: '🌾'
    };
    return icons[type] || '📋';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crop Calendar</h1>
          <p className="text-gray-600">Plan and track your farming activities</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Calendar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Calendars</h2>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton h-16 rounded-lg"></div>
                ))}
              </div>
            ) : calendars?.length > 0 ? (
              <div className="space-y-3">
                {calendars.map(cal => (
                  <button
                    key={cal._id}
                    onClick={() => setSelectedCalendar(cal._id)}
                    className={`w-full p-4 rounded-lg text-left transition-colors ${
                      selectedCalendar === cal._id
                        ? 'bg-primary-100 border-2 border-primary-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTaskIcon('planting')}</span>
                      <div>
                        <h3 className="font-medium text-gray-900">{cal.name}</h3>
                        <p className="text-sm text-gray-600">{cal.crop} • {cal.season}</p>
                      </div>
                    </div>
                    <span className={`mt-2 inline-block px-2 py-0.5 rounded text-xs ${getStatusColor(cal.status)}`}>
                      {cal.status}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 mb-2" size={40} />
                <p className="text-gray-500">No calendars yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {calendarDetail ? (
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{calendarDetail.name}</h2>
                    <p className="text-gray-600">
                      {calendarDetail.crop} • {calendarDetail.farm?.size} {calendarDetail.farm?.unit}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(calendarDetail.status)}`}>
                    {calendarDetail.status}
                  </span>
                </div>

                {calendarDetail.profitability && (
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Expenses</p>
                      <p className="text-lg font-semibold text-red-600">
                        {calendarDetail.profitability.totalExpenses?.toLocaleString()} TZS
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-lg font-semibold text-green-600">
                        {calendarDetail.profitability.totalRevenue?.toLocaleString()} TZS
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Profit</p>
                      <p className={`text-lg font-semibold ${
                        calendarDetail.profitability.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {calendarDetail.profitability.profit?.toLocaleString()} TZS
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {calendarDetail.overdueTasks?.length > 0 && (
                <div className="card border-l-4 border-l-red-500 bg-red-50">
                  <div className="flex items-center gap-2 text-red-800 mb-3">
                    <AlertTriangle size={20} />
                    <h3 className="font-semibold">Overdue Tasks</h3>
                  </div>
                  <div className="space-y-2">
                    {calendarDetail.overdueTasks.map(task => (
                      <div key={task._id} className="flex items-center justify-between p-2 bg-white rounded">
                        <div className="flex items-center gap-2">
                          <span>{getTaskIcon(task.type)}</span>
                          <span className="text-gray-900">{task.title}</span>
                        </div>
                        <button
                          onClick={() => completeTaskMutation.mutate({ 
                            calendarId: selectedCalendar, 
                            taskId: task._id 
                          })}
                          className="text-sm text-primary-600 hover:underline"
                        >
                          Mark Done
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
                {calendarDetail.upcomingTasks?.length > 0 ? (
                  <div className="space-y-3">
                    {calendarDetail.upcomingTasks.map(task => (
                      <div 
                        key={task._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTaskIcon(task.type)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600">
                              {format(new Date(task.scheduledDate), 'MMM d, yyyy')}
                              {isToday(new Date(task.scheduledDate)) && (
                                <span className="ml-2 text-primary-600 font-medium">Today</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => completeTaskMutation.mutate({ 
                            calendarId: selectedCalendar, 
                            taskId: task._id 
                          })}
                          disabled={completeTaskMutation.isPending}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                        >
                          <CheckCircle size={24} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No upcoming tasks</p>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <Leaf className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Calendar</h3>
              <p className="text-gray-500">Choose a calendar to view tasks and progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CropCalendar;
