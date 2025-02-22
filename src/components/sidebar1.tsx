'use client';

import { useEffect, useState, useRef } from 'react';
import { SidebarComponent, AccordionComponent, AccordionItemsDirective, AccordionItemDirective } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import styles from './page.module.css';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { useNavigate } from 'react-router-dom';


const Sidebar1 = ({ onLogout }: { onLogout: () => void }) => {
    const sidebar = useRef<SidebarComponent | null>(null);
    const accordion = useRef<AccordionComponent | null>(null);
    const location = useLocation(); // Get current route location
    const navigate = useNavigate();

    const data: any[] = [
        {
            id: 1,
            field: 'Home',
            fontIcon: 'e-home',
            path: '/dashboard' // Add path for navigation
        },
        {
            id: 2,
            field: 'My Dashboard',
            fontIcon: 'e-grid-view',
            path: '/dashboard' // Add path for navigation
        },
        {
            id: 3,
            field: 'Notifications',
            fontIcon: 'sf-icon-notification-bell-01',
            path: '/notifications' // Example path
        }
        ,
        {
            id: 3,
            field: 'Test Component',
            fontIcon: 'sf-icon-notification-bell-01',
            path: '/testcomponent' // Example path
        }        
    ];

    const handleItemClick = (item: any) => {
        if (item.path) {
            navigate(item.path);
        }
    };


    return (
        <section className="bg-white dark:bg-gray-950">
            <div id={styles["simple-sidebar"]} >
                <SidebarComponent key={"sidebar-1-tw"} className="bg-gray-50 dark:bg-gray-900 !border-r !border-gray-200 dark:!border-gray-700" width="256px" ref={sidebar} isOpen={true} style={{ display: 'block' }}>
                    <div className="h-screen">
                        {/* ... (rest of the sidebar content) */}
                        <div className="mt-1">
                            <ListViewComponent cssClass="border-0" dataSource={data} template={(dataItem: any) => (
                                <div className="e-list-wrapper flex items-center justify-between pr-2" onClick={() => handleItemClick(dataItem)} style={{cursor: 'pointer'}}> {/* Add onClick handler */}
                                    <span className="flex items-center">
                                        <span className={`e-icons ${dataItem.fontIcon} text-base`}></span>
                                        <span className="text-base font-normal pl-4">{dataItem.field}</span>
                                    </span>
                                    {dataItem.field === 'Notifications' && (<span className="e-badge e-badge-info e-badge-pill e-bigger !px-1.5">99+</span>)}
                                </div>)}
                            ></ListViewComponent>
                        </div>
                        {/* ... (rest of the sidebar content) */}
                    </div>
                </SidebarComponent>
            </div>
        </section>
    );
};

export default Sidebar1;
