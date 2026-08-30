import React, {
  useEffect,
  useState,
} from "react";

import {
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";

import ConsultantLayout from
  "../../components/consultant/ConsultantLayout";

import {
  getConsultantConsultations,
  getConversationMessages,
  sendChatMessage,
} from "../../services/api";


export default function Consultations() {

  const [consultations, setConsultations] =
    useState([]);

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [messageText, setMessageText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);


  // ==========================================================
  // LOAD CONSULTATIONS
  // ==========================================================

  useEffect(() => {

    const loadConsultations = async () => {

      try {

        setLoading(true);

        const data =
          await getConsultantConsultations();

        const consultationList =
          data.consultations || [];

        setConsultations(
          consultationList
        );

        if (
          consultationList.length > 0
        ) {

          const params =
            new URLSearchParams(
              window.location.search
            );

          const requestedId =
            Number(
              params.get("conversation")
            );

          const requestedConversation =
            consultationList.find(
              (item) =>
                item.conversation_id
                === requestedId
            );

          const conversation =
            requestedConversation ||
            consultationList[0];

          setSelectedConversation(
            conversation
          );

        }

      } catch (error) {

        console.error(
          "CONSULTATIONS ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadConsultations();

  }, []);


  // ==========================================================
  // LOAD MESSAGES
  // ==========================================================

  useEffect(() => {

    if (
      !selectedConversation
    ) {
      return;
    }

    const loadMessages = async () => {

      try {

        const data =
          await getConversationMessages(
            selectedConversation.conversation_id
          );

        setMessages(data || []);

      } catch (error) {

        console.error(
          "MESSAGES ERROR:",
          error
        );

      }

    };

    loadMessages();

  }, [
    selectedConversation,
  ]);


  // ==========================================================
  // SEND MESSAGE
  // ==========================================================

  const handleSendMessage = async (
    event
  ) => {

    event.preventDefault();

    if (
      !messageText.trim() ||
      !selectedConversation
    ) {
      return;
    }

    try {

      setSending(true);

      const newMessage =
        await sendChatMessage(
          selectedConversation.conversation_id,
          messageText
        );

      setMessages(
        (previousMessages) => [

          ...previousMessages,

          newMessage,

        ]
      );

      setMessageText("");

    } catch (error) {

      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to send message."
      );

    } finally {

      setSending(false);

    }

  };


  return (

    <ConsultantLayout
      title="Consultations"
    >

      {loading ? (

        <div className="ys-empty-card">

          <Loader2
            size={32}
            className="ys-loading-icon"
          />

          <p>
            Loading consultations...
          </p>

        </div>

      ) : consultations.length === 0 ? (

        <div className="ys-card ys-empty-card">

          <div>

            <div
              className="ys-empty-icon"
            >

              <MessageSquare
                size={31}
              />

            </div>

            <h2>
              No Consultations Yet
            </h2>

            <p>

              Conversations started
              by farmers will appear
              here.

            </p>

          </div>

        </div>

      ) : (

        <div
          className="ys-consultation-workspace"
        >


          {/* LEFT SIDE */}

          <aside
            className="ys-conversation-sidebar"
          >

            <h3>

              Farmer Conversations

            </h3>


            {consultations.map(
              (conversation) => (

                <button
                  key={
                    conversation.conversation_id
                  }
                  type="button"
                  onClick={() =>
                    setSelectedConversation(
                      conversation
                    )
                  }
                  className={`ys-conversation-item ${
                    selectedConversation
                      ?.conversation_id
                    ===
                    conversation.conversation_id
                      ? "active"
                      : ""
                  }`}
                >

                  <div
                    className="ys-avatar"
                  >

                    {
                      conversation.farmer
                        ?.full_name
                        ?.charAt(0)
                        ?.toUpperCase()
                    }

                  </div>


                  <div
                    className="ys-conversation-copy"
                  >

                    <strong>

                      {
                        conversation.farmer
                          ?.full_name
                      }

                    </strong>

                    <span>

                      {
                        conversation
                          .last_message
                          ?.message ||
                        "No messages yet"
                      }

                    </span>

                  </div>


                  {conversation.unread_count > 0 && (

                    <span
                      className="ys-unread-badge"
                    >

                      {
                        conversation.unread_count
                      }

                    </span>

                  )}

                </button>

              )
            )}

          </aside>


          {/* CHAT */}

          <section
            className="ys-chat-area"
          >

            {selectedConversation && (

              <>

                <div
                  className="ys-chat-header"
                >

                  <div>

                    <h3>

                      {
                        selectedConversation
                          .farmer
                          ?.full_name
                      }

                    </h3>

                    <span>

                      {
                        selectedConversation
                          .farmer
                          ?.location ||
                        "Farmer"
                      }

                    </span>

                  </div>

                </div>


                <div
                  className="ys-messages"
                >

                  {messages.map(
                    (message) => {

                      const isMine =
                        message.sender
                          ?.role
                        === "consultant";

                      return (

                        <div
                          key={message.id}
                          className={`ys-message-row ${
                            isMine
                              ? "mine"
                              : "theirs"
                          }`}
                        >

                          <div
                            className="ys-message"
                          >

                            <p>

                              {message.message}

                            </p>

                            <small>

                              {
                                message.created_at
                                  ? new Date(
                                      message.created_at
                                    ).toLocaleString()
                                  : ""
                              }

                            </small>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>


                <form
                  className="ys-message-form"
                  onSubmit={
                    handleSendMessage
                  }
                >

                  <input
                    value={messageText}
                    onChange={(event) =>
                      setMessageText(
                        event.target.value
                      )
                    }
                    placeholder="Write your response..."
                  />

                  <button
                    type="submit"
                    disabled={sending}
                  >

                    {sending ? (

                      <Loader2 size={18} />

                    ) : (

                      <Send size={18} />

                    )}

                  </button>

                </form>

              </>

            )}

          </section>

        </div>

      )}

    </ConsultantLayout>

  );

}