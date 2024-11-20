import * as React from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Text } from '~/components/ui/text';

interface AlreadyConnectedProps {
  isOpen: boolean;
  onClose: () => void;
  disconnectUser: () => void;
}

export default function AlreadyConnected({ isOpen, onClose, disconnectUser }: AlreadyConnectedProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>User Already Connected</DialogTitle>
          <DialogDescription>
            This user is already connected on another device. Do you want to disconnect them and log in here?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Cancel</Text>
          </Button>
          <Button variant="secondary" onPress={disconnectUser}>
            <Text>Disconnect and Log In</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}