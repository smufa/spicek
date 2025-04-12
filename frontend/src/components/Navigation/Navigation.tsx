// import { useState, useEffect } from 'react';
// import { Button, Burger, Drawer, Text, Box } from '@mantine/core';
// import { useNavigate, useLocation } from 'react-router-dom';

// export const Navigation = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [active, setActive] = useState(location.pathname);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Update active state when location changes
//   useEffect(() => {
//     setActive(location.pathname);
//   }, [location]);

//   const navItems = [
//     { label: 'Record', path: '/record' },
//     { label: 'Analyze', path: '/analyze' }
//   ];

//   // For small screens
//   const mobileNav = (
//     <Drawer opened={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu" padding="xl" size="sm">
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--mantine-spacing-lg)' }}>
//         {navItems.map((item) => (
//           <Button
//             key={item.path}
//             variant={active === item.path ? "filled" : "subtle"}
//             onClick={() => {
//               navigate(item.path);
//               setMobileOpen(false);
//             }}
//             fullWidth
//           >
//             {item.label}
//           </Button>
//         ))}
//       </div>
//     </Drawer>
//   );

//   return (
//     <Box 
//       py="md" 
//       px="md" 
//       style={{ 
//         position: 'sticky', 
//         top: 0, 
//         zIndex: 100,
//         backdropFilter: 'blur(10px)',
//         backgroundColor: 'rgba(255, 255, 255, 0.8)'
//       }}
//     >
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center'
//       }}>
//         <Text fw={700} size="lg">YourAppName</Text>
        
//         {/* Desktop Navigation */}
//         <div 
//           style={{ 
//             display: 'flex', 
//             gap: 'var(--mantine-spacing-sm)'
//           }}
//           className="desktop-nav"
//         >
//           <style>{`
//             @media (max-width: 768px) {
//               .desktop-nav {
//                 display: none;
//               }
//             }
//           `}</style>
//           {navItems.map((item) => (
//             <Button
//               key={item.path}
//               variant={active === item.path ? "filled" : "subtle"}
//               onClick={() => navigate(item.path)}
//               radius="md"
//             >
//               {item.label}
//             </Button>
//           ))}
//         </div>
        
//         {/* Mobile Navigation Burger */}
//         <Burger
//           opened={mobileOpen}
//           onClick={() => setMobileOpen(!mobileOpen)}
//           className="mobile-burger"
//           style={{
//             '@media (min-width: 769px)': { display: 'none' }
//           }}
//           hiddenFrom="sm"
//         />
//       </div>
      
//       {/* Mobile Navigation Drawer */}
//       {mobileNav}
//     </Box>
//   );
// };