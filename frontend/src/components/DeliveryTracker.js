import React from 'react';
import { MapPin, Truck, Package, CheckCircle, Clock } from 'lucide-react';
import { useDeliveryTracking } from '../hooks/useSocket';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'picked_up', label: 'Picked Up', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin }
];

function DeliveryTracker({ deliveryId, initialStatus, trackingNumber }) {
  const { location, status: liveStatus } = useDeliveryTracking(deliveryId);
  const currentStatus = liveStatus || initialStatus;

  const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Delivery Tracking</h3>
        <span className="text-sm text-gray-600">#{trackingNumber}</span>
      </div>

      <div className="relative">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-xs mt-2 text-center ${
                  isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {location && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <MapPin size={20} />
            <span className="font-medium">Live Location</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Driver is at: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            <Clock size={12} className="inline mr-1" />
            Updated just now
          </p>
        </div>
      )}

      {currentStatus === 'in_transit' && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-center">
          <Truck className="inline-block text-yellow-600 animate-bounce" size={24} />
          <p className="text-yellow-800 font-medium mt-1">Your order is on the way!</p>
        </div>
      )}

      {currentStatus === 'delivered' && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
          <CheckCircle className="inline-block text-green-600" size={24} />
          <p className="text-green-800 font-medium mt-1">Delivered successfully!</p>
        </div>
      )}
    </div>
  );
}

export default DeliveryTracker;
