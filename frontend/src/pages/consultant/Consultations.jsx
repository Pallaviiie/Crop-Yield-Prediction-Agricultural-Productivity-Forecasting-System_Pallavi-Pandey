import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
  RefreshCw,
  Loader2,
  User,
  Search,
  Clock,
  CheckCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import {
  getChatConversations,
  getConversationMessages,
  markConversationAsRead,
  sendChatMessage,
} from "../../services/api";

import "../../styles/consultant/Consultations.css";


// =========================================================
// HELPERS
// =========================================================

const getConversationId = (conversation) => {
  return (
    conversation?.id ??
    conversation?.conversation_id ??
    conversation?.conversationId ??
    null
  );
};


const getFarmerName = (conversation) => {
  return (
    conversation?.other_user?.full_name ||
    conversation?.other_user?.name ||
    conversation?.farmer?.full_name ||
    conversation?.farmer?.name ||
    conversation?.farmer_name ||
    conversation?.farmerName ||
    conversation?.user?.full_name ||
    conversation?.user?.name ||
    conversation?.full_name ||
    conversation?.name ||
    "Farmer"
  );
};


const getFarmerInitial = (conversation) => {
  const name = getFarmerName(conversation);

  return name
    .trim()
    .charAt(0)
    .toUpperCase();
};


const getLastMessage = (conversation) => {
  return (
    conversation?.last_message?.message ||
    conversation?.last_message?.text ||
    conversation?.lastMessage?.message ||
    conversation?.lastMessage?.text ||
    conversation?.last_message ||
    conversation?.lastMessage ||
    "No messages yet"
  );
};


const getLastMessageTime = (conversation) => {
  return (
    conversation?.last_message?.created_at ||
    conversation?.last_message?.createdAt ||
    conversation?.lastMessage?.created_at ||
    conversation?.lastMessage?.createdAt ||
    conversation?.updated_at ||
    conversation?.updatedAt ||
    conversation?.created_at ||
    conversation?.createdAt ||
    null
  );
};


const formatTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const sameDay =
    date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
};


const getMessageText = (message) => {
  if (typeof message?.message === "string") {
    return message.message;
  }

  if (typeof message?.text === "string") {
    return message.text;
  }

  return "";
};


// =========================================================
// COMPONENT
// =========================================================

const Consultations = () => {

  // =======================================================
  // CONVERSATIONS
  // =======================================================

  const [conversations, setConversations] = useState([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState(null);


  // =======================================================
  // MESSAGES
  // =======================================================

  const [messages, setMessages] = useState([]);


  // =======================================================
  // INPUT
  // =======================================================

  const [input, setInput] = useState("");


  // =======================================================
  // SEARCH
  // =======================================================

  const [searchTerm, setSearchTerm] = useState("");


  // =======================================================
  // LOADING
  // =======================================================

  const [loading, setLoading] = useState(true);

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [sending, setSending] = useState(false);

  const [refreshing, setRefreshing] = useState(false);


  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] = useState("");

  const [
    messageError,
    setMessageError,
  ] = useState("");


  // =======================================================
  // MOBILE
  // =======================================================

  const [
    mobileShowChat,
    setMobileShowChat,
  ] = useState(false);


  // =======================================================
  // REFS
  // =======================================================

  const messagesEndRef = useRef(null);

  const pollingRef = useRef(null);


  // =======================================================
  // LOAD CONVERSATIONS
  // =======================================================

  const loadConversations = async (
    showRefreshLoader = false
  ) => {

    try {

      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data =
        await getChatConversations();

      console.log(
        "Consultant conversations:",
        data
      );

      let conversationList = [];

      if (Array.isArray(data)) {

        conversationList = data;

      } else if (
        Array.isArray(data?.conversations)
      ) {

        conversationList =
          data.conversations;

      } else if (
        Array.isArray(data?.data)
      ) {

        conversationList = data.data;
      }

      setConversations(
        conversationList
      );


      // ---------------------------------------------------
      // Keep selected conversation updated
      // ---------------------------------------------------

      if (selectedConversation) {

        const selectedId =
          getConversationId(
            selectedConversation
          );

        const updatedConversation =
          conversationList.find(
            (conversation) =>
              String(
                getConversationId(
                  conversation
                )
              ) ===
              String(selectedId)
          );

        if (updatedConversation) {

          setSelectedConversation(
            updatedConversation
          );

        }
      }

    } catch (err) {

      console.error(
        "Failed to load conversations:",
        err
      );

      setError(
        err?.message ||
        "Unable to load consultations."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadConversations();

  }, []);


  // =======================================================
  // LOAD MESSAGES
  // =======================================================

  const loadMessages = async (
    conversation,
    showLoader = true,
    markRead = false
  ) => {

    const conversationId =
      getConversationId(
        conversation
      );


    // ---------------------------------------------------
    // Invalid conversation
    // ---------------------------------------------------

    if (!conversationId) {

      setMessages([]);

      return;
    }


    try {

      if (showLoader) {

        setMessagesLoading(true);

      }

      setMessageError("");


      // -------------------------------------------------
      // GET MESSAGES
      // -------------------------------------------------

      const data =
        await getConversationMessages(
          conversationId
        );

      console.log(
        "Conversation messages:",
        data
      );


      let messageList = [];


      if (Array.isArray(data)) {

        messageList = data;

      } else if (
        Array.isArray(data?.messages)
      ) {

        messageList =
          data.messages;

      } else if (
        Array.isArray(data?.data)
      ) {

        messageList =
          data.data;
      }


      setMessages(
        messageList
      );


      // -------------------------------------------------
      // MARK CONVERSATION AS READ
      //
      // This is only called when the consultant
      // opens the conversation.
      // It is NOT called during polling.
      // -------------------------------------------------

      if (markRead) {

        try {

          await markConversationAsRead(
            conversationId
          );

          console.log(
            "Conversation marked as read:",
            conversationId
          );


          // ---------------------------------------------
          // Remove unread badge immediately
          // ---------------------------------------------

          setConversations(
            (previous) =>
              previous.map(
                (item) => {

                  const itemId =
                    getConversationId(
                      item
                    );

                  if (
                    String(itemId) ===
                    String(conversationId)
                  ) {

                    return {
                      ...item,

                      unread_count: 0,

                      unreadCount: 0,
                    };

                  }

                  return item;
                }
              )
          );


          // ---------------------------------------------
          // Update selected conversation
          // ---------------------------------------------

          setSelectedConversation(
            (previous) => {

              if (!previous) {
                return previous;
              }

              const previousId =
                getConversationId(
                  previous
                );

              if (
                String(previousId) ===
                String(conversationId)
              ) {

                return {
                  ...previous,

                  unread_count: 0,

                  unreadCount: 0,
                };

              }

              return previous;
            }
          );

        } catch (readError) {

          console.error(
            "Failed to mark conversation as read:",
            readError
          );

          // Do not stop the chat if the
          // read API fails.
        }
      }

    } catch (err) {

      console.error(
        "Failed to load messages:",
        err
      );


      if (showLoader) {

        setMessageError(
          err?.message ||
          "Unable to load conversation messages."
        );

      }

    } finally {

      if (showLoader) {

        setMessagesLoading(false);

      }

    }
  };


  // =======================================================
  // SELECT CONVERSATION
  // =======================================================

  const openConversation = async (
    conversation
  ) => {

    if (!conversation) {
      return;
    }


    setSelectedConversation(
      conversation
    );

    setMobileShowChat(true);

    setMessages([]);

    setInput("");

    setMessageError("");


    // -----------------------------------------------
    // true = show loading
    // true = mark unread messages as read
    // -----------------------------------------------

    await loadMessages(
      conversation,
      true,
      true
    );
  };


  // =======================================================
  // POLLING
  // =======================================================

  useEffect(() => {

    // -----------------------------------------------
    // No selected conversation
    // -----------------------------------------------

    if (!selectedConversation) {

      if (pollingRef.current) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current = null;
      }

      return;
    }


    const conversationId =
      getConversationId(
        selectedConversation
      );


    if (!conversationId) {
      return;
    }


    // -----------------------------------------------
    // Poll every 5 seconds
    // -----------------------------------------------

    pollingRef.current =
      setInterval(
        async () => {

          try {

            const data =
              await getConversationMessages(
                conversationId
              );


            let messageList = [];


            if (Array.isArray(data)) {

              messageList = data;

            } else if (
              Array.isArray(
                data?.messages
              )
            ) {

              messageList =
                data.messages;

            } else if (
              Array.isArray(data?.data)
            ) {

              messageList =
                data.data;
            }


            setMessages(
              messageList
            );

          } catch (err) {

            console.error(
              "Conversation polling failed:",
              err
            );

          }

        },
        5000
      );


    // -----------------------------------------------
    // Cleanup
    // -----------------------------------------------

    return () => {

      if (pollingRef.current) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current = null;
      }

    };

  }, [selectedConversation]);


  // =======================================================
  // AUTO SCROLL
  // =======================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // =======================================================
  // SEND MESSAGE
  // =======================================================

  const handleSendMessage = async () => {

    const text =
      input.trim();


    const conversationId =
      getConversationId(
        selectedConversation
      );


    if (
      !text ||
      !conversationId ||
      sending
    ) {

      return;
    }


    setSending(true);

    setMessageError("");

    setInput("");


    // ===================================================
    // TEMPORARY MESSAGE
    // ===================================================

    const temporaryMessage = {

      id:
        `temp-${Date.now()}`,

      message:
        text,

      text:
        text,

      sender:
        "consultant",

      sender_type:
        "consultant",

      temporary:
        true,

      created_at:
        new Date().toISOString(),

    };


    setMessages(
      (previous) => [
        ...previous,
        temporaryMessage,
      ]
    );


    try {

      // =================================================
      // SEND TO BACKEND
      // =================================================

      const savedMessage =
        await sendChatMessage(
          conversationId,
          text
        );


      console.log(
        "Consultant message saved:",
        savedMessage
      );


      // =================================================
      // REMOVE TEMPORARY MESSAGE
      // ADD REAL MESSAGE
      // =================================================

      setMessages(
        (previous) => {

          const withoutTemporary =
            previous.filter(
              (message) =>
                !message.temporary
            );


          return [
            ...withoutTemporary,

            {
              ...savedMessage,

              sender:
                savedMessage?.sender ||
                "consultant",

              sender_type:
                savedMessage?.sender_type ||
                "consultant",
            },
          ];

        }
      );


      // =================================================
      // REFRESH CONVERSATION LIST
      // =================================================

      await loadConversations(
        false
      );

    } catch (err) {

      console.error(
        "Failed to send consultant message:",
        err
      );


      // Remove temporary message

      setMessages(
        (previous) =>
          previous.filter(
            (message) =>
              !message.temporary
          )
      );


      // Restore input

      setInput(text);


      setMessageError(
        err?.message ||
        "Unable to send message."
      );

    } finally {

      setSending(false);

    }
  };


  // =======================================================
  // ENTER KEY
  // =======================================================

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSendMessage();

    }
  };


  // =======================================================
  // MOBILE BACK
  // =======================================================

  const handleMobileBack = () => {

    setMobileShowChat(false);

  };


  // =======================================================
  // FILTER CONVERSATIONS
  // =======================================================

  const filteredConversations =
    conversations.filter(
      (conversation) => {

        const farmerName =
          getFarmerName(
            conversation
          ).toLowerCase();


        const lastMessage =
          String(
            getLastMessage(
              conversation
            )
          ).toLowerCase();


        const search =
          searchTerm
            .trim()
            .toLowerCase();


        if (!search) {
          return true;
        }


        return (
          farmerName.includes(
            search
          ) ||
          lastMessage.includes(
            search
          )
        );

      }
    );


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div className="consultations-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="consultations-page-header">

        <div>

          <div className="consultations-title-row">

            <div className="consultations-title-icon">

              <MessageCircle
                size={22}
              />

            </div>


            <div>

              <h1>
                Consultations
              </h1>

              <p>
                Communicate directly with farmers
                and provide agricultural guidance.
              </p>

            </div>

          </div>

        </div>


        <button
          type="button"
          className="consultations-refresh-button"
          onClick={() =>
            loadConversations(true)
          }
          disabled={
            refreshing ||
            loading
          }
        >

          {refreshing ? (

            <Loader2
              size={17}
              className="consultations-spin"
            />

          ) : (

            <RefreshCw
              size={17}
            />

          )}

          <span>
            Refresh
          </span>

        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="consultations-error">

          <AlertCircle
            size={18}
          />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              loadConversations(true)
            }
          >
            Try again
          </button>

        </div>

      )}


      {/* =================================================
          MAIN CHAT AREA
      ================================================= */}

      <div
        className={`consultations-chat-container ${
          mobileShowChat
            ? "mobile-chat-open"
            : ""
        }`}
      >


        {/* =================================================
            LEFT - CONVERSATIONS
        ================================================= */}

        <aside className="consultations-sidebar">

          <div className="consultations-sidebar-header">

            <div>

              <h2>
                Conversations
              </h2>

              <span>
                {conversations.length}{" "}
                {conversations.length === 1
                  ? "conversation"
                  : "conversations"}
              </span>

            </div>

          </div>


          {/* SEARCH */}

          <div className="consultations-search">

            <Search
              size={17}
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search farmers..."
            />

          </div>


          {/* =================================================
              CONVERSATION LIST
          ================================================= */}

          <div className="conversation-list">

            {loading ? (

              <div className="conversations-loading">

                <Loader2
                  size={24}
                  className="consultations-spin"
                />

                <span>
                  Loading conversations...
                </span>

              </div>

            ) : filteredConversations.length === 0 ? (

              <div className="no-conversations">

                <div className="no-conversations-icon">

                  <MessageCircle
                    size={27}
                  />

                </div>

                <strong>
                  {searchTerm
                    ? "No conversations found"
                    : "No consultations yet"}
                </strong>

                <span>
                  {searchTerm
                    ? "Try a different search."
                    : "Farmer conversations will appear here when they contact you."}
                </span>

              </div>

            ) : (

              filteredConversations.map(
                (conversation) => {

                  const conversationId =
                    getConversationId(
                      conversation
                    );


                  const isSelected =
                    String(
                      getConversationId(
                        selectedConversation
                      )
                    ) ===
                    String(
                      conversationId
                    );


                  const unreadCount =
                    Number(
                      conversation?.unread_count ??
                      conversation?.unreadCount ??
                      0
                    );


                  return (

                    <button
                      type="button"
                      key={conversationId}
                      className={`conversation-item ${
                        isSelected
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        openConversation(
                          conversation
                        )
                      }
                    >


                      {/* AVATAR */}

                      <div className="conversation-avatar">

                        {conversation?.farmer?.profile_image ? (

                          <img
                            src={
                              conversation.farmer.profile_image
                            }
                            alt=""
                          />

                        ) : (

                          getFarmerInitial(
                            conversation
                          )

                        )}

                      </div>


                      {/* CONTENT */}

                      <div className="conversation-item-content">

                        <div className="conversation-item-top">

                          <strong>
                            {getFarmerName(
                              conversation
                            )}
                          </strong>

                          <span>
                            {formatTime(
                              getLastMessageTime(
                                conversation
                              )
                            )}
                          </span>

                        </div>


                        <div className="conversation-item-bottom">

                          <p>
                            {getLastMessage(
                              conversation
                            )}
                          </p>


                          {/* UNREAD BADGE */}

                          {unreadCount > 0 && (

                            <span className="unread-count">

                              {unreadCount}

                            </span>

                          )}

                        </div>

                      </div>

                    </button>

                  );

                }
              )

            )}

          </div>

        </aside>


        {/* =================================================
            RIGHT - CHAT
        ================================================= */}

        <section className="consultations-chat-panel">


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!selectedConversation ? (

            <div className="consultation-empty-state">

              <div className="consultation-empty-icon">

                <MessageCircle
                  size={38}
                />

              </div>

              <h2>
                Select a conversation
              </h2>

              <p>
                Choose a farmer from the
                conversation list to view their
                messages and respond.
              </p>

            </div>

          ) : (

            <>


              {/* =================================================
                  CHAT HEADER
              ================================================= */}

              <div className="consultation-chat-header">

                <button
                  type="button"
                  className="mobile-back-button"
                  onClick={
                    handleMobileBack
                  }
                >

                  <ArrowLeft
                    size={20}
                  />

                </button>


                <div className="consultation-chat-user-avatar">

                  {getFarmerInitial(
                    selectedConversation
                  )}

                </div>


                <div className="consultation-chat-user-info">

                  <h2>
                    {getFarmerName(
                      selectedConversation
                    )}
                  </h2>

                  <span>

                    <span className="chat-online-dot" />

                    Farmer consultation

                  </span>

                </div>

              </div>


              {/* =================================================
                  MESSAGES
              ================================================= */}

              <div className="consultation-messages">

                {messagesLoading ? (

                  <div className="consultation-messages-loading">

                    <Loader2
                      size={27}
                      className="consultations-spin"
                    />

                    <span>
                      Loading messages...
                    </span>

                  </div>

                ) : messageError ? (

                  <div className="conversation-message-error">

                    <AlertCircle
                      size={22}
                    />

                    <span>
                      {messageError}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        loadMessages(
                          selectedConversation,
                          true,
                          true
                        )
                      }
                    >
                      Retry
                    </button>

                  </div>

                ) : messages.length === 0 ? (

                  <div className="no-messages">

                    <div className="no-messages-icon">

                      <MessageCircle
                        size={28}
                      />

                    </div>

                    <strong>
                      No messages yet
                    </strong>

                    <span>
                      Start the consultation by
                      sending a message to the farmer.
                    </span>

                  </div>

                ) : (

                  messages.map(
                    (message) => {

                      const senderType =
                        String(
                          message?.sender_type ??
                          message?.sender_role ??
                          message?.role ??
                          message?.sender?.role ??
                          message?.sender ??
                          ""
                        ).toLowerCase();


                      const isConsultant =
                        message?.temporary ||
                        senderType ===
                          "consultant" ||
                        senderType ===
                          "expert" ||
                        senderType ===
                          "admin";


                      return (

                        <div
                          key={
                            message.id ??
                            `${message.created_at}-${message.message}`
                          }
                          className={`consultation-message-row ${
                            isConsultant
                              ? "consultant-message-row"
                              : "farmer-message-row"
                          }`}
                        >


                          {/* FARMER AVATAR */}

                          {!isConsultant && (

                            <div className="message-avatar farmer-message-avatar">

                              <User
                                size={16}
                              />

                            </div>

                          )}


                          {/* MESSAGE BUBBLE */}

                          <div
                            className={`consultation-message-bubble ${
                              isConsultant
                                ? "consultant-bubble"
                                : "farmer-bubble"
                            }`}
                          >

                            <div className="message-content">

                              {getMessageText(
                                message
                              )}

                            </div>


                            <div className="message-meta">

                              <span>

                                {formatTime(
                                  message?.created_at ??
                                  message?.createdAt
                                )}

                              </span>


                              {/* CONSULTANT MESSAGE STATUS */}

                              {isConsultant && (

                                message?.temporary ? (

                                  <Clock
                                    size={12}
                                  />

                                ) : (

                                  <CheckCheck
                                    size={13}
                                  />

                                )

                              )}

                            </div>

                          </div>


                          {/* CONSULTANT AVATAR */}

                          {isConsultant && (

                            <div className="message-avatar consultant-message-avatar">

                              <User
                                size={16}
                              />

                            </div>

                          )}

                        </div>

                      );

                    }
                  )

                )}


                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>


              {/* =================================================
                  MESSAGE ERROR
              ================================================= */}

              {messageError && (

                <div className="message-send-error">

                  <AlertCircle
                    size={15}
                  />

                  {messageError}

                </div>

              )}


              {/* =================================================
                  INPUT
              ================================================= */}

              <div className="consultation-input-container">

                <textarea
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder={`Reply to ${getFarmerName(
                    selectedConversation
                  )}...`}
                  rows={1}
                  disabled={sending}
                />


                <button
                  type="button"
                  className="consultation-send-button"
                  onClick={
                    handleSendMessage
                  }
                  disabled={
                    !input.trim() ||
                    sending
                  }
                  title="Send message"
                >

                  {sending ? (

                    <Loader2
                      size={19}
                      className="consultations-spin"
                    />

                  ) : (

                    <Send
                      size={19}
                    />

                  )}

                </button>

              </div>


              {/* =================================================
                  DISCLAIMER
              ================================================= */}

              <div className="consultation-disclaimer">

                <MessageCircle
                  size={13}
                />

                <span>
                  Your response will be delivered
                  directly to the farmer's Chat Expert.
                </span>

              </div>

            </>

          )}

        </section>

      </div>

    </div>
  );
};


export default Consultations;
