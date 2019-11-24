import React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { RouteComponentProps } from 'react-router-dom';
import { toast } from 'react-toastify';
import { emailSignUp, emailSignUpVariables } from 'src/types/api';
import { LOG_USER_IN } from '../../sharedQueries.local';
import { EMAIL_SIGN_IN } from './EmailQueries';
import EmailSignUpPresenter from './EmailSignUpPresenter';


class LoginMutation extends Mutation<
    emailSignUp,
    emailSignUpVariables
> {}

interface IState {
    firstName: String;
    lastName: String;
    email: String;
    password: String;
    profilePhoto: String;
    age: Number;
    phoneNumber: String;
}

interface IProps extends RouteComponentProps<any> {}

class EmailSignUpContainer extends React.Component<IProps, IState> {
  public state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profilePhoto: "",
    age: 0,
    phoneNumber: ""
  };
  public emailMutation: MutationFn;
  public render() {
    return (
      <Mutation mutation={LOG_USER_IN}>
        {logUserIn => (
          <LoginMutation
            mutation={EMAIL_SIGN_IN}
            onCompleted={data => {
              const { EmailSignUp } = data;
              if (EmailSignUp.ok) {
                logUserIn({
                  variables: {
                    token: EmailSignUp.token
                  }
                });
              } else {
                toast.error(EmailSignUp.error);
              }
            }}
          >
            {(emailMutation, { loading }) => {
              this.emailMutation = emailMutation;
              return (
                <EmailSignUpPresenter loginCallback={this.loginCallback} />
              );
            }}
          </LoginMutation>
        )}
      </Mutation>
    );
  }

//   public loginCallback = response => {
//     const { name, first_name, last_name, email, id, accessToken } = response;
//     if (accessToken) {
//       toast.success(`${name}님 회원가입 됐습니다`);
//       this.emailMutation({
//         variables: {
//           email,
//           fbId: id,
//           firstName: first_name,
//           lastName: last_name
//         }
//       });
//     } else {
//       toast.error("로그인 할 수 없습니다 😔");
//     }
//   };

}

export default EmailSignUpContainer;