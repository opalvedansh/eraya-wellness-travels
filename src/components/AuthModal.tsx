"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginPanel from "./LoginPanel";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-beige border-beige-dark/20">
                <LoginPanel onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
}
