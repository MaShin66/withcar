import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { toast } from "react-toastify";
import {
  startPhoneVerification,
  startPhoneVerificationVariables
} from "../../types/api";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { PHONE_SIGN_IN } from "./PhoneQueries"; // Query 에서 Data 송수신 하기 위해

interface IState {
  countryCode: string;
  phoneNumber: string;
}

class PhoneSignInMutation extends Mutation<startPhoneVerification, startPhoneVerificationVariables> {}

class PhoneLoginContainer extends React.Component<
  RouteComponentProps<any>,
  IState
> {
  public phoneMutation: MutationFn;

  public state = {
    countryCode: "+82",
    phoneNumber: ""
  };

  public render() {
    const { history } = this.props;
    const { countryCode, phoneNumber } = this.state;

    return (
      <PhoneSignInMutation // 쿼리가 담겨있는 < >
        mutation={PHONE_SIGN_IN} // 위에서 선언한 쿼리 이름 적고
        variables={{ phoneNumber: `${countryCode}${phoneNumber}`  }} // PHONE_SIGN_IN 가 변수를 phoneNumber 받으니까

        onCompleted={data => { // onCompleted 했을 때 쿼리로 받아온 리턴값이 data
          const { StartPhoneVerification } = data;
          const phone = `${countryCode}${phoneNumber}`;
          if (StartPhoneVerification.ok) {
            toast.success("SMS로 코드가 전송되었습니다.");
            setTimeout(() => {
              history.push({
                pathname: "/verify-phone",
                state: { phone }
              });
            }, 2000);
          } else {
            toast.error(StartPhoneVerification.error);
          }
        }}
      >

        {(phoneMutation, { loading }) => {
          this.phoneMutation = phoneMutation;
          return ( // 보여주기 위한 PhoneLoginPresenter 로 넘어가는 곳
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              loading={loading}
            />
          );
        }}

      </PhoneSignInMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = event => {
    const { target: { name, value } } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}${phoneNumber}`;
    // 번호 유효한지 정규화 코드
    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
    // const isValid = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/.test(phone);
    if (isValid) {
      this.phoneMutation();
    } else {
      toast.error("올바른 휴대폰 번호를 입력해주세요");
    }
  };
}

export default PhoneLoginContainer;