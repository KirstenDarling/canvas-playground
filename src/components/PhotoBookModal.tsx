import React from "react";

interface PhotoBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (options: { pages: number; size: string }) => void;
  options: { pages: number; size: string };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const PhotoBookModal: React.FC<PhotoBookModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  options,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md">
        <h2 className="text-xl font-bold mb-4">Photo Book Options</h2>
        <div className="mb-4">
          <label htmlFor="pages" className="block text-gray-700 font-bold mb-2">
            Number of Pages (1-20):
          </label>
          <input
            type="number"
            id="pages"
            name="pages"
            min="1"
            max="20"
            value={options.pages}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="size" className="block text-gray-700 font-bold mb-2">
            Page Size:
          </label>
          <select
            id="size"
            name="size"
            value={options.size}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="4x6">4x6</option>
            <option value="8x11">8x11</option>
            <option value="11x14">11x14</option>
            <option value="12x12">12x12</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onCreate(options)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200"
          >
            Create Photo Book
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoBookModal;
