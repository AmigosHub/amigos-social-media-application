
// src/pages/Chat.jsx
import { useState } from 'react'
import { Container, Grid, useMediaQuery, useTheme, Box, alpha, Typography } from '@mui/material' // <-- Added Typography and alpha
import ChatList from '../components/Chat/ChatList'
import ChatWindow from '../components/Chat/ChatWindow'
import { useAuth } from '../context/AuthContext'

const Chat = () => {
  const theme = useTheme()
  const { currentUser } = useAuth()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [showChatWindow, setShowChatWindow] = useState(false)

  const handleSelectChat = (conversation) => {
    setSelectedConversation(conversation)
    if (isMobile) {
      setShowChatWindow(true)
    }
  }

  const handleBack = () => {
    setSelectedConversation(null)
    setShowChatWindow(false)
  }

  // Helper function to get the other user in conversation
  const getOtherUser = (conversation) => {
    if (!conversation || !currentUser) return null
    return conversation.user1?.id === currentUser.id 
      ? conversation.user2 
      : conversation.user1
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 1, sm: 2, md: 3 },
        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ height: '100%' }}>
        {/* Chat List - Always visible on desktop, hidden on mobile when chat is open */}
        <Grid
          size={{ xs: 12, md: 4, lg: 3.5 }}
          sx={{
            display: isMobile && showChatWindow ? 'none' : 'block',
            height: '100%',
            pr: { xs: 0, sm: 0 },
          }}
        >
          <ChatList 
            onSelectChat={handleSelectChat} 
            selectedUserId={getOtherUser(selectedConversation)?.id}
          />
        </Grid>

        {/* Chat Window - Only show when a conversation is selected */}
        <Grid
          size={{ xs: 12, md: 8, lg: 8.5 }}
          sx={{
            height: '100%',
            display: isMobile && !showChatWindow ? 'none' : 'block',
            pl: { xs: 0, sm: 0 },
          }}
        >
          {selectedConversation ? (
            <ChatWindow 
              selectedConversation={selectedConversation}
              onBack={handleBack}
              isMobile={isMobile}
            />
          ) : (
            // Show placeholder when no conversation is selected (desktop only)
            !isMobile && (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h2" sx={{ fontSize: 40 }}>
                    💬
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Your Messages
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Chat