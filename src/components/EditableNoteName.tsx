// EditableNoteName.tsx
"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

type EditableNoteNameProps = {
  noteId: number;
  noteName: string;
};

const EditableNoteName: React.FC<EditableNoteNameProps> = ({ noteId, noteName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(noteName);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.patch(`/api/notes/${noteId}`, { name });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update note name:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new name"
          />
          <Button onClick={handleUpdate} className="bg-purple-700" disabled={loading}>
            Save
          </Button>
          <Button onClick={() => setIsEditing(false)} variant="outline">
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-stone-500 font-semibold">{name}</span>
          <Pencil
            className="w-4 h-4 ml-2 cursor-pointer text-purple-600"
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}
    </div>
  );
};

export default EditableNoteName;
