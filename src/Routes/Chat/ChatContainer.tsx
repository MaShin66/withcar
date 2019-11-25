import { SubscribeToMoreOptions } from "apollo-client";
import React from "react";
import { Mutation, MutationFn, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "../../sharedQueries";
import {
  getChat,
  getChatVariables,
  sendMessage,
  sendMessageVariables,
  userProfile
} from "../../types/api";
import ChatPresenter from "./ChatPresenter";
import { GET_CHAT, SEND_MESSAGE, SUBSCRIBE_TO_MESSAGES } from "./ChatQueries";

interface IProps extends RouteComponentProps<any> {}
interface IState {
  message: "";
}

class ProfileQuery extends Query<userProfile> {}
class ChatQuery extends Query<getChat, getChatVariables> {}
class SendMessageMutation extends Mutation<sendMessage, sendMessageVariables> {}

class ChatContainer extends React.Component<IProps, IState> {
  public sendMessageFn: MutationFn;
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.chatId) {
      props.history.push("/");
    }
    this.state = {
      message: ""
    };
  }
  public render() {
    // 여기도 chatId 가 string이라 강제로 Int 변환 필요
    // const { match: { params: { chatId } } } = this.props;
    const chatId = Number(this.props.match.params.chatId);
    // const chatId = tmp;
    const { message } = this.state;

    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <ChatQuery query={GET_CHAT} variables={{ chatId }}>
            {({ data, loading, subscribeToMore }) => {
              const subscribeToMoreOptions: SubscribeToMoreOptions = {
                document: SUBSCRIBE_TO_MESSAGES,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  const { data: { MessageSubscription } } = subscriptionData;
                  const { GetChat: { chat: { messages } } } = prev;
                  // console.log('MessageSubscription: ', MessageSubscription);
                  // console.log('messages: ', messages);
                  const newMessageId = MessageSubscription.id;

                  // 바로 대화 시작하면 안돼서 새로고침 했어야 했는데 바꿔서 해결
                  if (messages.length > 0) {
                    const latestMessageId = messages[messages.length - 1].id;
                    //   메모리 누수로 인한 메세지 중복을 막아주는 코드
                    if (newMessageId === latestMessageId) {
                      return;
                    }
                  }

                  const newObject = Object.assign({}, prev, {
                    GetChat: {
                      ...prev.GetChat,
                      chat: {
                        ...prev.GetChat.chat,
                        messages: [
                          ...prev.GetChat.chat.messages,
                          MessageSubscription
                        ]
                      }
                    }
                  });
                  return newObject;
                }
              };
              subscribeToMore(subscribeToMoreOptions);
              return (
                <SendMessageMutation mutation={SEND_MESSAGE}>
                  {sendMessageFn => {
                    this.sendMessageFn = sendMessageFn;
                    return (
                      <ChatPresenter
                        data={data}
                        loading={loading}
                        userData={userData}
                        messageText={message}
                        onInputChange={this.onInputChange}
                        onSubmit={this.onSubmit}
                      />
                    );
                  }}
                </SendMessageMutation>
              );
            }}
          </ChatQuery>
        )}
      </ProfileQuery>
    );
  }

  // 아래부터 함수
  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onSubmit = () => {
    const { message } = this.state;
    // const { match: { params: { chatId } } } = this.props;
    const chatId = Number(this.props.match.params.chatId);
    if (message !== "") {
      this.setState({
        message: ""
      });
      this.sendMessageFn({
        variables: {
          chatId,
          text: message
        }
      });
    }
    return;
  };
}

export default ChatContainer;