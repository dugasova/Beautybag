import { useState } from 'react';
import './Menu.css';
import { menuItems } from '../../mockedData';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Menu() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearchByLabel = (label: string) => {
    navigate(`/category/${label}`);
    setActiveItem(null); // Close the dropdown menu
  };

  return (
    <div className='navigation-container'>
      <nav className='navigation'>
        <ul className='navigation-list'>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className='navigation-item'
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
            >
              {item.label}
              <AnimatePresence>
                {activeItem === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className='menu-list-nested-wrapper'
                  >
                    <ul className='menu-list-nested'>
                      {item.children?.map((child) => (
                        <li 
                          key={child.id} 
                          className='menu-item-nested'
                          onClick={() => handleSearchByLabel(child.label)}
                        >
                          {child.label}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}