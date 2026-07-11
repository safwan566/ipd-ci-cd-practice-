'use client';

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export function FullScreenLoader() {
    const [animationData, setAnimationData] = useState<object | null>(null);

    useEffect(() => {
        let isMounted = true;
        fetch('/loading.json')
            .then((response) => response.json())
            .then((data) => {
                if (isMounted) {
                    setAnimationData(data);
                }
            })
            .catch((error) => {
                console.error('Failed to load Lottie animation:', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-56 h-56">
                {animationData ? (
                    <Lottie animationData={animationData} loop />
                ) : (
                    <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto"></div>
                )}
            </div>
        </div>
    );
}
