import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  Send,
  Bot,
  User,
  Sprout,
  CloudRain,
  Thermometer,
  Droplets,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  UserRoundCheck,
  ChevronDown,
  Loader2,
  MessageCircle,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  RefreshCw,
} from "lucide-react";

import "../../styles/farmer/ChatExpert.css";


// =========================================================
// API CONFIGURATION
// =========================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";


// =========================================================
// TOKEN HELPER
// =========================================================

const getAuthToken = () => {

  const possibleKeys = [
    "access_token",
    "token",
    "authToken",
    "jwt",
  ];

  for (const key of possibleKeys) {

    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
};


// =========================================================
// API REQUEST HELPER
// =========================================================

const apiRequest = async (
  endpoint,
  options = {}
) => {

  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {

    const errorMessage =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(errorMessage);
  }

  return data;
};


// =========================================================
// COMPONENT
// =========================================================

const ChatExpert = () => {

  // =======================================================
  // CHAT MODE
  // =======================================================

  const [chatMode, setChatMode] = useState("ai");


  // =======================================================
  // CONSULTANTS
  // =======================================================

  const [consultants, setConsultants] = useState([]);

  const [selectedConsultant, setSelectedConsultant] =
    useState(null);

  const [consultantLoading, setConsultantLoading] =
    useState(false);

  const [consultantError, setConsultantError] =
    useState("");


  // =======================================================
  // CONVERSATION
  // =======================================================

  const [conversation, setConversation] =
    useState(null);

  const [conversationLoading, setConversationLoading] =
    useState(false);


  // =======================================================
  // MESSAGES
  // =======================================================

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "expert",
      text:
        "Hello! I'm your YieldSense AI Farm Expert. I can help you with crop selection, irrigation, soil nutrients, weather conditions, yield improvement and farming decisions.",
    },
  ]);


  // =======================================================
  // INPUT
  // =======================================================

  const [input, setInput] = useState("");

  const [isTyping, setIsTyping] = useState(false);


  // =======================================================
  // REFS
  // =======================================================

  const messagesEndRef = useRef(null);

  const pollingRef = useRef(null);


  // =======================================================
  // AUTO SCROLL
  // =======================================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, isTyping]);


  // =======================================================
  // LOAD CONSULTANTS
  // =======================================================

  const loadConsultants = async () => {

    setConsultantLoading(true);

    setConsultantError("");

    try {

      const data =
        await apiRequest(
          "/chat/consultants"
        );

      setConsultants(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load consultants:",
        error
      );

      setConsultantError(
        error.message ||
        "Unable to load agricultural consultants."
      );

    } finally {

      setConsultantLoading(false);
    }
  };


  // =========================================================
  // INITIAL CONSULTANT LOAD
  // =========================================================

  useEffect(() => {

    loadConsultants();

  }, []);


  // =========================================================
  // LOAD CONVERSATION MESSAGES
  // =========================================================

  const loadConversationMessages = async (
    conversationId
  ) => {

    try {

      const data =
        await apiRequest(
          `/chat/conversations/${conversationId}/messages`
        );

      setMessages(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load messages:",
        error
      );

    }
  };


  // =========================================================
  // SELECT CONSULTANT
  // =========================================================

  const selectConsultant = async (
    consultant
  ) => {

    if (!consultant) {
      return;
    }

    setSelectedConsultant(consultant);

    setConversationLoading(true);

    setConsultantError("");

    try {

      const data =
        await apiRequest(
          "/chat/conversations",
          {
            method: "POST",

            body: JSON.stringify({
              consultant_id:
                consultant.id,
            }),
          }
        );

      setConversation(data);

      await loadConversationMessages(
        data.id
      );

    } catch (error) {

      console.error(
        "Failed to create conversation:",
        error
      );

      setConsultantError(
        error.message ||
        "Unable to start conversation with this consultant."
      );

      setConversation(null);

    } finally {

      setConversationLoading(false);
    }
  };


  // =========================================================
  // SWITCH TO AI
  // =========================================================

  const switchToAI = () => {

    setChatMode("ai");

    setSelectedConsultant(null);

    setConversation(null);

    setMessages([
      {
        id: Date.now(),
        sender: "expert",
        text:
          "Hello! I'm your YieldSense AI Farm Expert. How can I help you with your farm today?",
      },
    ]);

    setInput("");
  };


  // =========================================================
  // SWITCH TO CONSULTANT MODE
  // =========================================================

  const switchToConsultant = () => {

    setChatMode("consultant");

    setInput("");

    if (selectedConsultant) {

      if (conversation) {

        loadConversationMessages(
          conversation.id
        );

      }

    } else {

      setMessages([
        {
          id: Date.now(),
          sender: "expert",
          text:
            "Select an agricultural consultant above to start a conversation with a farming professional.",
        },
      ]);

    }
  };


  // =========================================================
  // POLLING FOR NEW CONSULTANT MESSAGES
  // =========================================================

  useEffect(() => {

    if (
      chatMode !== "consultant" ||
      !conversation?.id
    ) {

      if (pollingRef.current) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current = null;
      }

      return;
    }


    pollingRef.current =
      setInterval(() => {

        loadConversationMessages(
          conversation.id
        );

      }, 5000);


    return () => {

      if (pollingRef.current) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current = null;
      }

    };

  }, [
    chatMode,
    conversation?.id,
  ]);


  // =========================================================
  // AI EXPERT RESPONSE
  // =========================================================

  const generateResponse = (
    question
  ) => {

    const text =
      question.toLowerCase();


    if (
      text.includes("crop") ||
      text.includes("what should i grow") ||
      text.includes("which crop")
    ) {

      return (
        "I can help you select a suitable crop based on soil type, rainfall, temperature, soil moisture and nutrient levels. Open AI Recommendations after entering your farm conditions to see the crops ranked by suitability."
      );
    }


    if (
      text.includes("water") ||
      text.includes("irrigation") ||
      text.includes("moisture")
    ) {

      return (
        "Irrigation should be adjusted according to soil moisture, rainfall, crop type and weather conditions. Avoid over-irrigation because excessive soil moisture can cause waterlogging and root-related problems."
      );
    }


    if (
      text.includes("nitrogen") ||
      text.includes("fertilizer") ||
      text.includes("nutrient")
    ) {

      return (
        "Nitrogen, phosphorus and potassium should ideally be managed using soil-test results. Avoid applying excessive fertilizer because it can increase production costs and nutrient losses."
      );
    }


    if (
      text.includes("rain") ||
      text.includes("rainfall") ||
      text.includes("weather")
    ) {

      return (
        "Rainfall is an important factor in crop planning. Low rainfall may increase irrigation requirements, while excessive rainfall can increase waterlogging and disease risk. Check the Weather section for current conditions."
      );
    }


    if (
      text.includes("temperature") ||
      text.includes("heat")
    ) {

      return (
        "High temperatures can increase evaporation and crop water requirements. During heat conditions, monitor soil moisture and irrigation carefully."
      );
    }


    if (
      text.includes("yield") ||
      text.includes("production")
    ) {

      return (
        "Yield can be influenced by crop selection, soil nutrients, irrigation, rainfall, temperature and farm management. You can use the Yield Prediction section to estimate expected crop productivity."
      );
    }


    if (
      text.includes("soil") ||
      text.includes("ph")
    ) {

      return (
        "Soil type and soil pH influence nutrient availability and crop suitability. Soil testing is recommended before making major fertilizer or soil-management decisions."
      );
    }


    return (
      "I can help you with crop selection, yield prediction, irrigation, rainfall, temperature, soil conditions, fertilizer management and farming recommendations. Please tell me more about your farm or the problem you are facing."
    );
  };


  // =========================================================
  // SEND AI MESSAGE
  // =========================================================

  const sendAIMessage = (
    question
  ) => {

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: question,
    };


    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");

    setIsTyping(true);


    setTimeout(() => {

      const response =
        generateResponse(
          question
        );


      const expertMessage = {
        id: Date.now() + 1,
        sender: "expert",
        text: response,
      };


      setMessages((previous) => [
        ...previous,
        expertMessage,
      ]);

      setIsTyping(false);

    }, 700);
  };


  // =========================================================
  // SEND CONSULTANT MESSAGE
  // =========================================================

  const sendConsultantMessage = async (
    question
  ) => {

    if (!conversation?.id) {

      setConsultantError(
        "Please select an agricultural consultant first."
      );

      return;
    }


    const temporaryMessage = {
      id: `temp-${Date.now()}`,
      sender: "user",
      sender_id: null,
      message: question,
      text: question,
      created_at: new Date().toISOString(),
      is_read: false,
      temporary: true,
    };


    setMessages((previous) => [
      ...previous,
      temporaryMessage,
    ]);

    setInput("");


    try {

      const savedMessage =
        await apiRequest(
          `/chat/conversations/${conversation.id}/messages`,
          {
            method: "POST",

            body: JSON.stringify({
              message: question,
            }),
          }
        );


      setMessages((previous) => {

        const withoutTemporary =
          previous.filter(
            (message) =>
              !message.temporary
          );

        return [
          ...withoutTemporary,
         {
             ...savedMessage,
             sender: savedMessage.sender || "user",
         },
        ];

      });

    } catch (error) {

      console.error(
        "Failed to send consultant message:",
        error
      );


      setMessages((previous) =>
        previous.filter(
          (message) =>
            !message.temporary
        )
      );


      setConsultantError(
        error.message ||
        "Unable to send message."
      );
    }
  };


  // =========================================================
  // MAIN SEND MESSAGE
  // =========================================================

  const sendMessage = () => {

    const question =
      input.trim();


    if (
      !question ||
      isTyping ||
      conversationLoading
    ) {

      return;
    }


    setConsultantError("");


    if (chatMode === "ai") {

      sendAIMessage(question);

      return;
    }


    sendConsultantMessage(
      question
    );
  };


  // =========================================================
  // ENTER KEY
  // =========================================================

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }

  };


  // =========================================================
  // QUICK QUESTIONS
  // =========================================================

  const quickQuestions = [
    {
      icon: Sprout,
      text: "Which crop should I grow?",
    },
    {
      icon: Droplets,
      text: "How should I manage irrigation?",
    },
    {
      icon: FlaskConical,
      text: "How can I improve soil nutrients?",
    },
    {
      icon: CloudRain,
      text: "How does rainfall affect my crop?",
    },
  ];


  const askQuickQuestion = (
    question
  ) => {

    setInput(question);
  };


  // =========================================================
  // CLEAR CHAT
  // =========================================================

  const clearChat = () => {

    if (
      chatMode === "consultant" &&
      selectedConsultant
    ) {

      setMessages([]);

      setTimeout(() => {

        setMessages([
          {
            id: Date.now(),
            sender: "expert",
            text:
              `You are chatting with ${selectedConsultant.full_name}. Send a message to discuss your farming question.`,
          },
        ]);

      }, 50);

      return;
    }


    setMessages([
      {
        id: Date.now(),
        sender: "expert",
        text:
          "Hello! I'm your YieldSense AI Farm Expert. How can I help you with your farm today?",
      },
    ]);
  };


  // =========================================================
  // REFRESH CONSULTANTS
  // =========================================================

  const refreshConsultants = () => {

    loadConsultants();
  };


  // =========================================================
  // FORMAT MESSAGE TEXT
  // =========================================================

  const getMessageText = (
    message
  ) => {

    if (
      typeof message.text === "string"
    ) {

      return message.text;
    }


    if (
      typeof message.message === "string"
    ) {

      return message.message;
    }


    return "";
  };


  // =========================================================
// CURRENT USER / SENDER DETECTION
// =========================================================

const getCurrentUserId = () => {
  // Try common localStorage keys first
  const possibleKeys = [
    "user_id",
    "userId",
    "current_user_id",
    "currentUserId",
  ];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  // Try getting user ID from JWT
  const token = getAuthToken();

  if (token) {
    try {
      const parts = token.split(".");

      if (parts.length === 3) {
        const base64Url = parts[1];

        const base64 = base64Url
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const payload = JSON.parse(
          atob(base64)
        );

        return (
          payload.user_id ??
          payload.id ??
          payload.sub ??
          null
        );
      }
    } catch (error) {
      console.error(
        "Unable to decode authentication token:",
        error
      );
    }
  }

  return null;
};


const isCurrentUserMessage = (message) => {

  // -------------------------------------------------------
  // Temporary messages created by the frontend
  // -------------------------------------------------------

  if (
    message.temporary ||
    message.sender === "user"
  ) {
    return true;
  }


  // -------------------------------------------------------
  // Get sender ID from backend message
  // -------------------------------------------------------

  const senderId =
    message.sender_id ??
    message.senderId ??
    message.user_id ??
    message.userId;


  const currentUserId =
    getCurrentUserId();


  // -------------------------------------------------------
  // Most reliable method:
  // Compare sender_id with logged-in user's ID
  // -------------------------------------------------------

  if (
    senderId !== null &&
    senderId !== undefined &&
    currentUserId !== null &&
    currentUserId !== undefined
  ) {

    return (
      String(senderId) ===
      String(currentUserId)
    );
  }


  // -------------------------------------------------------
  // Check sender type / role returned by backend
  // -------------------------------------------------------

  const senderType = String(
    message.sender_type ??
    message.sender_role ??
    message.role ??
    message.sender ??
    ""
  ).toLowerCase();


  // These mean CURRENT FARMER / USER
  if (
    senderType === "user" ||
    senderType === "farmer" ||
    senderType === "customer" ||
    senderType === "client" ||
    senderType === "me"
  ) {
    return true;
  }


  // These mean CONSULTANT / RECEIVER
  if (
    senderType === "consultant" ||
    senderType === "expert" ||
    senderType === "admin" ||
    senderType === "receiver"
  ) {
    return false;
  }


  // Default to receiver
  return false;
};

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="chat-expert-page">


      {/* =====================================================
          BANNER
      ===================================================== */}

      <div className="chat-expert-banner">

        <div className="chat-expert-banner-icon">
          <MessageCircle size={30} />
        </div>

        <div>

          <h2>
            Chat with Farm Expert
          </h2>

          <p>
            Get AI-powered farming guidance or connect
            directly with an agricultural consultant.
          </p>

        </div>

      </div>


      {/* =====================================================
          CHAT MODE SELECTOR
      ===================================================== */}

      <div className="chat-mode-selector">


        <button
          type="button"
          className={`chat-mode-button ${
            chatMode === "ai"
              ? "active"
              : ""
          }`}
          onClick={switchToAI}
        >

          <div className="chat-mode-icon">
            <Bot size={18} />
          </div>

          <div className="chat-mode-text">

            <strong>
              AI Farm Expert
            </strong>

            <span>
              Instant farming guidance
            </span>

          </div>

        </button>


        <button
          type="button"
          className={`chat-mode-button ${
            chatMode === "consultant"
              ? "active"
              : ""
          }`}
          onClick={switchToConsultant}
        >

          <div className="chat-mode-icon consultant-mode-icon">
            <UserRoundCheck size={18} />
          </div>

          <div className="chat-mode-text">

            <strong>
              Agricultural Consultant
            </strong>

            <span>
              Chat with a farming professional
            </span>

          </div>

        </button>

      </div>


      {/* =====================================================
          CONSULTANT SELECTOR
      ===================================================== */}

      {chatMode === "consultant" && (

        <div className="consultant-selector-card">


          <div className="consultant-selector-header">

            <div>

              <div className="selector-title">

                <UserRoundCheck size={17} />

                <span>
                  Select Agricultural Consultant
                </span>

              </div>

              <p>
                Choose a registered agricultural consultant
                to start or continue a conversation.
              </p>

            </div>


            <button
              type="button"
              className="refresh-consultants-button"
              onClick={refreshConsultants}
              disabled={consultantLoading}
              title="Refresh consultants"
            >

              {consultantLoading ? (
                <Loader2
                  size={16}
                  className="spin"
                />
              ) : (
                <RefreshCw size={16} />
              )}

              <span>
                Refresh
              </span>

            </button>

          </div>


          {consultantLoading ? (

            <div className="consultant-loading">

              <Loader2
                size={22}
                className="spin"
              />

              <span>
                Loading agricultural consultants...
              </span>

            </div>

          ) : consultants.length === 0 ? (

            <div className="no-consultants">

              <UserRoundCheck size={28} />

              <strong>
                No consultants available
              </strong>

              <span>
                There are currently no registered agricultural
                consultants available for consultation.
              </span>

            </div>

          ) : (

            <div className="consultant-list">

              {consultants.map(
                (consultant) => {

                  const isSelected =
                    selectedConsultant?.id ===
                    consultant.id;


                  return (
                    <button
                      type="button"
                      key={consultant.id}
                      className={`consultant-option ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        selectConsultant(
                          consultant
                        )
                      }
                    >


                      {/* PROFILE */}

                      <div className="consultant-avatar">

                        {consultant.profile_image ? (

                          <img
                            src={
                              consultant.profile_image
                            }
                            alt=""
                          />

                        ) : (

                          <User size={20} />

                        )}

                      </div>


                      {/* DETAILS */}

                      <div className="consultant-details">

                        <div className="consultant-name-row">

                          <strong>
                            {consultant.full_name}
                          </strong>

                          {isSelected && (
                            <span className="selected-badge">
                              Selected
                            </span>
                          )}

                        </div>


                        <div className="consultant-detail-row">

                          <span>

                            <GraduationCap
                              size={13}
                            />

                            {consultant.qualification ||
                              "Agricultural Consultant"}

                          </span>

                        </div>


                        <div className="consultant-detail-row">

                          <span>

                            <BriefcaseBusiness
                              size={13}
                            />

                            {consultant.specialization ||
                              "General Agriculture"}

                          </span>

                        </div>


                        {consultant.location && (

                          <div className="consultant-detail-row">

                            <span>

                              <MapPin
                                size={13}
                              />

                              {consultant.location}

                            </span>

                          </div>

                        )}

                      </div>


                      <ChevronDown
                        size={17}
                        className="consultant-arrow"
                      />

                    </button>
                  );

                }
              )}

            </div>

          )}


          {consultantError && (

            <div className="consultant-error">

              {consultantError}

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          CHAT CARD
      ===================================================== */}

      <div className="chat-expert-card">


        {/* ===================================================
            CHAT HEADER
        =================================================== */}

        <div className="chat-header">


          <div className="chat-expert-profile">


            <div className="chat-bot-avatar">

              {chatMode === "ai" ? (
                <Bot size={21} />
              ) : (
                <UserRoundCheck size={21} />
              )}

            </div>


            <div>

              <h3>

                {chatMode === "ai"
                  ? "YieldSense Farm Expert"
                  : selectedConsultant
                    ? selectedConsultant.full_name
                    : "Agricultural Consultant"
                }

              </h3>


              <span>

                {chatMode === "ai"
                  ? "AI Agricultural Assistant"
                  : selectedConsultant
                    ? "Agricultural Consultant"
                    : "Select a consultant above"
                }

              </span>

            </div>

          </div>


          <button
            type="button"
            className="clear-chat-button"
            onClick={clearChat}
            title="Clear chat"
          >

            <RotateCcw size={16} />

            Clear

          </button>

        </div>


        {/* ===================================================
            CONSULTANT STATUS
        =================================================== */}

        {chatMode === "consultant" &&
          selectedConsultant && (

            <div className="consultant-chat-status">

              <span className="online-dot" />

              <span>
                Conversation with{" "}
                <strong>
                  {selectedConsultant.full_name}
                </strong>
              </span>

            </div>

          )}


        {/* ===================================================
            MESSAGES
        =================================================== */}

        <div className="chat-messages">


          {conversationLoading ? (

            <div className="chat-loading">

              <Loader2
                size={25}
                className="spin"
              />

              <span>
                Opening conversation...
              </span>

            </div>

          ) : messages.length === 0 ? (

            <div className="empty-chat">

              <div className="empty-chat-icon">

                <MessageCircle
                  size={28}
                />

              </div>

              <strong>
                Start your conversation
              </strong>

              <span>
                Send a message to your agricultural
                consultant.
              </span>

            </div>

          ) : (

            messages.map(
              (message) => {

                const isUser =
                  isCurrentUserMessage(
                    message
                  );


                return (
                  <div
                    key={message.id}
                    className={`chat-message-row ${
                      isUser
                        ? "user-message-row"
                        : "expert-message-row"
                    }`}
                  >


                    {!isUser && (

                      <div className="message-avatar expert-avatar">

                        {chatMode === "ai" ? (
                          <Bot size={17} />
                        ) : (
                          <UserRoundCheck
                            size={17}
                          />
                        )}

                      </div>

                    )}


                    <div
                      className={`chat-message ${
                        isUser
                          ? "user-message"
                          : "expert-message"
                      }`}
                    >

                      {getMessageText(
                        message
                      )}

                    </div>


                    {isUser && (

                      <div className="message-avatar user-avatar">

                        <User size={17} />

                      </div>

                    )}

                  </div>
                );

              }
            )

          )}


          {isTyping && (

            <div className="chat-message-row expert-message-row">

              <div className="message-avatar expert-avatar">

                <Bot size={17} />

              </div>

              <div className="typing-message">

                <span />
                <span />
                <span />

              </div>

            </div>

          )}


          <div ref={messagesEndRef} />

        </div>


        {/* ===================================================
            QUICK QUESTIONS
        =================================================== */}

        {chatMode === "ai" && (

          <div className="quick-question-section">


            <div className="quick-question-title">

              <Lightbulb size={15} />

              <span>
                Quick questions
              </span>

            </div>


            <div className="quick-question-grid">

              {quickQuestions.map(
                (item, index) => {

                  const Icon =
                    item.icon;


                  return (

                    <button
                      type="button"
                      key={index}
                      className="quick-question"
                      onClick={() =>
                        askQuickQuestion(
                          item.text
                        )
                      }
                    >

                      <Icon size={16} />

                      <span>
                        {item.text}
                      </span>

                    </button>

                  );

                }
              )}

            </div>

          </div>

        )}


        {/* ===================================================
            INPUT
        =================================================== */}

        <div className="chat-input-area">


          <textarea
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            onKeyDown={handleKeyDown}
            placeholder={
              chatMode === "ai"
                ? "Ask your AI farm expert something..."
                : selectedConsultant
                  ? `Message ${selectedConsultant.full_name}...`
                  : "Select a consultant first..."
            }
            rows={1}
            disabled={
              chatMode === "consultant" &&
              (
                !selectedConsultant ||
                conversationLoading
              )
            }
          />


          <button
            type="button"
            className="send-message-button"
            onClick={sendMessage}
            disabled={
              !input.trim() ||
              isTyping ||
              conversationLoading ||
              (
                chatMode === "consultant" &&
                !selectedConsultant
              )
            }
            title="Send message"
          >

            {conversationLoading ? (
              <Loader2
                size={19}
                className="spin"
              />
            ) : (
              <Send size={19} />
            )}

          </button>

        </div>


        {/* ===================================================
            DISCLAIMER
        =================================================== */}

        <div className="chat-disclaimer">

          <span>

            <Sprout size={13} />

            {chatMode === "ai"
              ? "AI recommendations are decision-support suggestions. Consider local agricultural expertise before major farming decisions."
              : "Consultant advice is provided through YieldSense. For critical farming decisions, consider local agricultural and field conditions."
            }

          </span>

        </div>

      </div>

    </div>
  );
};


export default ChatExpert;