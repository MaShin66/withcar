import React from "react";
// import { Link } from "react-router-dom";
// import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import Message from "../../Components/Message";
import styled from "../../typed-components";
import { getChat, userProfile } from "../../types/api";

const Container = styled.div``;

const Chat = styled.div`
  height: 80vh;
  overflow: scroll;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InputCont = styled.div`
  padding: 0 20px;
`;

// const ExtendedButton = styled(Button)`
//   margin-bottom: 30px;
// `;

interface IProps {
  data?: getChat;
  userData?: userProfile;
  loading: boolean;
  messageText: string;
  onSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatPresenter: React.SFC<IProps> = ({
  data: { GetChat: { chat = null } = {} } = {},
  userData: { GetMyProfile: { user = null } = {} } = {},
  loading,
  messageText,
  onInputChange,
  onSubmit
}) => (
  <Container>
    <Header title={"채팅방"} />
    {!loading &&
      chat &&
      user && (
        <React.Fragment>
          {/* <Link to={`/ride/${chatId}`}>
                <ExtendedButton value={"뒤로가기"} onClick={null} />
          </Link> */}
          <Chat>
            {chat.messages &&
              chat.messages.map(message => {
                if (message) {
                  return (
                    <Message
                      key={message.id}
                      text={message.text}
                      mine={user.id === message.userId}
                    />
                  );
                }
                return null;
              })}
          </Chat>
          <InputCont>
            <Form submitFn={onSubmit}>
              <Input
                value={messageText}
                placeholder={"메세지를 입력하세요"}
                onChange={onInputChange}
                name={"message"}
              />
            </Form>
          </InputCont>
        </React.Fragment>
      )}
  </Container>
);

export default ChatPresenter;