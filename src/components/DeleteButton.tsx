'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

type Props = {
	noteId: number;
};
const DeleteButton = ({ noteId }: Props) => {
	const router = useRouter();

	const deleteNote = useMutation({
		mutationFn: async () => {
			const response = await axios.post('/api/deleteNote', {
				noteId,
			});

			return response.data;
		},
	});

	return (
		<Trash
			size={24} // Set the size explicitly (e.g., 24px)
			className="text-gray-500 hover:text-red-600 transition duration-200 cursor-pointer"
			onClick={() => {
				const confirm = window.confirm('Do you really want to delete the current notebook?');
				if (!confirm) return;

				deleteNote.mutate(undefined, {
					onSuccess: () => {
						router.push('/dashboard');
					},
					onError: (err) => {
						console.error(err);
					},
				});
			}}
		/>
	);
};
export default DeleteButton;
