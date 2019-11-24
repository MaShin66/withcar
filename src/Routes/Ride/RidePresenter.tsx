// 드라이버가 수락하면 양쪽 다 뜨는 창

import React from "react";
import { MutationFn } from "react-apollo";
import { Link } from "react-router-dom";
import Button from "../../Components/Button";
import styled from "../../typed-components";
import { getRide, userProfile } from "../../types/api";

const Container = styled.div`
  padding: 40px;
`;

const Title = styled.h4`
  font-weight: 800;
  margin-top: 30px;
  margin-bottom: 10px;
  &:first-child {
    margin-top: 0;
  }
`;

const Data = styled.span`
  color: ${props => props.theme.blueColor};
`;

const Img = styled.img`
  border-radius: 50%;
  margin-right: 20px;
  max-width: 50px;
  height: 50px;
`;

const Passenger = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Buttons = styled.div`
  margin: 30px 0px;
`;

const ExtendedButton = styled(Button)`
  margin-bottom: 30px;
`;

interface IProps {
  data?: getRide;
  userData?: userProfile;
  loading: boolean;
  updateRideFn: MutationFn;
}

const RidePresenter: React.SFC<IProps> = ({
  data: { GetRide: { ride = null } = {} } = {},
  userData: { GetMyProfile: { user = null } = {} } = {},
  updateRideFn
}) => (
  <Container>
    {ride && user && (
        <React.Fragment>
          <Title>탑승자</Title>
          <Passenger>
            <Img src={ride.passenger.profilePhoto} />
            <Data>{ride.passenger.fullName!}</Data>
          </Passenger>
          {ride.driver && (
            <React.Fragment>
              <Title>운전자</Title>
              <Passenger>
                <Img src={ride.driver.profilePhoto} />
                <Data>{ride.driver.fullName!}</Data>
              </Passenger>
            </React.Fragment>
          )}
          <Title>출발지</Title>
          <Data>{ride.pickUpAddress}</Data>
          <Title>도착지</Title>
          <Data>{ride.dropOffAddress}</Data>
          <Title>금액</Title>
          <Data>{ride.price}</Data>
          <Title>거리</Title>
          <Data>{ride.distance}</Data>
          {/* <Title>Duration</Title>
          <Data>{ride.duration}</Data> */}
          <Title>상태</Title>
          <Data>{ride.status}</Data>

{/* 조건에 따라 다르게 보여주는 버튼 */}
          <Buttons>
            {ride.driver &&
              ride.driver.id === user.id &&
              ride.status === "ACCEPTED" && (
                <ExtendedButton
                  value={"이용자 탑승 완료"}
                  onClick={() =>
                    updateRideFn({
                      variables: {
                        rideId: ride.id,
                        status: "ONROUTE"
                      }
                    })
                  }
                />
              )}
            {ride.driver &&
              ride.driver.id === user.id &&
              ride.status === "ONROUTE" && (
                <ExtendedButton
                  value={"운행 완료"}
                  onClick={() =>
                    updateRideFn({
                      variables: {
                        rideId: ride.id,
                        status: "FINISHED"
                      }
                    })
                  }
                />
              )}

            {ride.status !== "REQUESTING" && (
              <Link to={`/chat/${ride.chatId}`}>
                <ExtendedButton value={"대화하기"} onClick={null} />
              </Link>
            )}
          </Buttons>

          <Link to={`/`}>
            <ExtendedButton value={"취소하기"} onClick={null} />
          </Link>
          
        </React.Fragment>
      )}
  </Container>
);

export default RidePresenter;