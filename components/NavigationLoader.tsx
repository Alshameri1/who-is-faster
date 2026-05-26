'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isLoadingRef = useRef(false);

    const startLoading = React.useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        setShow(true);
        isLoadingRef.current = true;
        setProgress(0);

        progressIntervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev < 30) return prev + 3;
                if (prev < 70) return prev + 1;
                if (prev < 90) return prev + 0.2;
                if (prev < 95) return prev + 0.05;
                return prev;
            });
        }, 30);
    }, []);

    const completeLoading = React.useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        if (isLoadingRef.current) {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setProgress(100);
            
            // Minimal delay just to let the 100% transition be visible before fade out
            setTimeout(() => {
                isLoadingRef.current = false;
                setShow(false);
                setTimeout(() => {
                    setProgress(0);
                }, 200); // Reset progress after fade out
            }, 200);
        }
    }, []);

    // Detect navigation start via click listener
    useEffect(() => {
        const handleAnchorClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest('a');

            if (anchor && anchor instanceof HTMLAnchorElement) {
                const href = anchor.getAttribute('href');
                const isInternal = href && (href.startsWith('/') || href.startsWith(window.location.origin));
                const isNewTab = anchor.getAttribute('target') === '_blank';

                if (isInternal && !isNewTab && href !== pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')) {
                    startLoading();
                }
            }
        };

        window.addEventListener('click', handleAnchorClick);
        return () => window.removeEventListener('click', handleAnchorClick);
    }, [pathname, searchParams, startLoading]);

    // Detect navigation completion
    useEffect(() => {
        if (isLoadingRef.current) {
            completeLoading();
        }
    }, [pathname, searchParams, completeLoading]);


    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 right-0 z-1000 h-1.5pointer-events-none"
                >
                    {/* Progress Bar Container */}
                    <div className="relative w-full h-full bg-transparent overflow-hidden">
                        {/* The Actual Bar */}
                        <motion.div
                            className="h-full bg-blue-500 relative"
                            initial={{ width: '0%' }}
                            animate={{ width: `${progress}%` }}
                            transition={progress === 100 ? { duration: 0.3, ease: "easeOut" } : { duration: 0.1 }}
                        >
                            {/* Neon Glow Effect */}
                            <div className="absolute right-0 top-0 h-full w-25 shadow-[0_0_15px_3px_#2196F3] opacity-80" />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
