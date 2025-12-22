import { ReactNode } from "react";
import { Drawer } from "vaul";
import { motion } from "framer-motion";

interface MapBottomSheetProps {
    children: ReactNode;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    snapPoints?: number[];
    defaultSnap?: number;
}

export default function MapBottomSheet({
    children,
    isOpen = true,
    onOpenChange,
    snapPoints = [0.3, 0.85],
    defaultSnap = 0.3,
}: MapBottomSheetProps) {
    return (
        <Drawer.Root
            open={isOpen}
            onOpenChange={onOpenChange}
            snapPoints={snapPoints}
            activeSnapPoint={defaultSnap}
            dismissible={false}
            modal={false}
        >
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/20 lg:hidden" />
                <Drawer.Content
                    className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-white rounded-t-[20px] shadow-2xl lg:hidden"
                    style={{
                        maxHeight: "85vh",
                    }}
                >
                    {/* Drag Handle */}
                    <div className="flex items-center justify-center py-4 px-4 border-b border-border/50 bg-white/95 backdrop-blur-sm rounded-t-[20px] sticky top-0 z-10">
                        <motion.div
                            className="w-12 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing"
                            whileTap={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        />
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        {children}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
