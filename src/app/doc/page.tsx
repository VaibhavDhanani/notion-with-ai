"use client"

import LoadingSpinner from '@/components/LoadingSpinner';
import NewDocumentButton from '@/components/NewDocumentButton';
import SidebarOption from '@/components/SidebarOption';
import { RoomDocument } from '@/interface/interface';
import { db } from '@/lib/firebase';
import { useUser } from '@clerk/nextjs';
import { collectionGroup, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FileText, Share2 } from 'lucide-react';

const DocIndexPage = () => {
  const { user } = useUser();
  const [groupedData, setGroupData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
    viewer: RoomDocument[];
  }>({
    owner: [],
    editor: [],
    viewer: [],
  });
  
  const [data, loading, error] = useCollection(
    user &&
    query(
      collectionGroup(db, "rooms"),
      where("userId", "==", user.emailAddresses[0].emailAddress)
    )
  );

  useEffect(() => {
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
      viewer: RoomDocument[];
    }>(
      (acc, current) => {
        const roomData = current.data() as RoomDocument;
        acc[roomData.role].push({ id: current.id, ...roomData });
        return acc;
      },
      {
        owner: [],
        editor: [],
        viewer: [],
      }
    );

    setGroupData(grouped);
  }, [data]);

  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if(error){
    toast.error("Failed to load documents");
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={headerVariants.hidden}
          animate={headerVariants.show}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Your Documents
        </motion.h1>
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <NewDocumentButton />
        </motion.div>
        
        <div className="flex flex-col space-y-12">
          {/* My Documents */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-4"
          >
            <motion.div 
              variants={headerVariants}
              className="flex items-center space-x-2"
            >
              <FileText size={18} className="text-blue-500" />
              <h2 className="text-gray-800 text-lg font-semibold">
                My Documents
              </h2>
            </motion.div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {groupedData.owner.length === 0 ? (
                <motion.div 
                  variants={itemVariants}
                  className="p-6 text-center"
                >
                  <p className="text-gray-500 italic">
                    No documents yet. Create your first document!
                  </p>
                </motion.div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {groupedData.owner.map((doc) => (
                    <motion.div 
                      key={doc.id}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
                      className="p-1"
                    >
                      <SidebarOption id={doc.id} href={`/doc/${doc.id}`} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Shared with Me */}
          {(groupedData.editor.length > 0 || groupedData.viewer.length > 0) && (
            <motion.div 
              initial="hidden"
              animate="show" 
              variants={containerVariants}
              className="space-y-4"
            >
              <motion.div 
                variants={headerVariants}
                className="flex items-center space-x-2"
              >
                <Share2 size={18} className="text-green-500" />
                <h2 className="text-gray-800 text-lg font-semibold">
                  Shared With Me
                </h2>
              </motion.div>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {[...groupedData.editor, ...groupedData.viewer].map((doc) => (
                    <motion.div 
                      key={doc.id}
                      variants={itemVariants}
                      whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.7)" }}
                      className="p-1"
                    >
                      <SidebarOption id={doc.id} href={`/doc/${doc.id}`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DocIndexPage;