import React, { createContext, useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {db} from '../firebaseConfig/firebase';

/*initializeApp(firebaseConfig);
const db = getFirestore();*/

export const NovedadesContext = createContext();

export const NovedadesProvider = ({ children }) => {
    const [novedades, setNovedades] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'novedades'), (snapshot) => {
            const novedadesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNovedades(novedadesData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <NovedadesContext.Provider value={{ novedades }}>
            {children}
        </NovedadesContext.Provider>
    );
};
