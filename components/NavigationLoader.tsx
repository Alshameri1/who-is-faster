'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const triggerLoader = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('startNavigation'));
};

export const stopLoader = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('stopNavigation'));
};

export default function NavigationLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

    const isLoadingRef = useRef(false);

    const startLoading = React.useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);

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

        // Safe fallback timeout of 5 seconds
        fallbackTimerRef.current = setTimeout(() => {
            if (isLoadingRef.current) {
                console.warn('NavigationLoader: 5s fallback timeout reached. Forcing complete.');
                completeLoading();
            }
        }, 5000);
    }, []);

    const completeLoading = React.useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        
        if (isLoadingRef.current) {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setProgress(100);
            
            // Minimal delay just to let the 100% transition be visible before fade out
            timerRef.current = setTimeout(() => {
                isLoadingRef.current = false;
                setShow(false);
                setTimeout(() => {
                    setProgress(0);
                }, 300); // Reset progress after fade out
            }, 300);
        }
    }, []);

    // Detect navigation start via click listener on anchors and custom events
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

        const handleCustomStart = () => startLoading();
        const handleCustomStop = () => completeLoading();

        window.addEventListener('click', handleAnchorClick);
        window.addEventListener('startNavigation', handleCustomStart);
        window.addEventListener('stopNavigation', handleCustomStop);

        return () => {
            window.removeEventListener('click', handleAnchorClick);
            window.removeEventListener('startNavigation', handleCustomStart);
            window.removeEventListener('stopNavigation', handleCustomStop);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            if (timerRef.current) clearTimeout(timerRef.current);
            if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        };
    }, [pathname, searchParams, startLoading, completeLoading]);

    // Detect navigation completion
    useEffect(() => {
        if (isLoadingRef.current) {
            completeLoading();
        }
    }, [pathname, searchParams, completeLoading]);

    if (!show && progress === 0) return null;

    return (
        <div 
            className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300 ease-out"
            style={{ opacity: show ? 1 : 0 }}
        >
            {/* Progress Bar Container */}
            <div className="relative w-full h-1.5 bg-transparent overflow-hidden">
                {/* The Actual Bar using CSS transforms for hardware acceleration */}
                <div
                    className="h-full bg-blue-500 relative origin-left"
                    style={{ 
                        transform: `scaleX(${progress / 100})`,
                        transition: progress === 100 ? 'transform 0.3s ease-out' : 'transform 0.1s linear'
                    }}
                >
                    {/* Neon Glow Effect */}
                    <div className="absolute right-0 top-0 h-full w-24 shadow-[0_0_15px_3px_#2196F3] opacity-80" />
                </div>
            </div>
        </div>
    );
}
