import { SubscribeToMoreOptions } from "apollo-client";
import React from "react";
import { Mutation, Query } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import { USER_PROFILE } from "../../sharedQueries";
import {
  getRide,
  getRideVariables,
  updateRide,
  updateRideVariables,
  userProfile
} from "../../types/api";
import RidePresenter from "./RidePresenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";

class ProfileQuery extends Query<userProfile> {}
class RideQuery extends Query<getRide, getRideVariables> {}
class RideUpdate extends Mutation<updateRide, updateRideVariables> {}

interface IProps extends RouteComponentProps<any> {}

class RideContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    // HomeContainer.tsx 에서 넘어온 RequestRide 안의 rideId 가 없다면 기본 주소로 이동
    // history.push 로 넘어온 값은 history, location, match 에 담기는데 이 중 match 에 우리가 원하는 값이 있다.
    if (!props.match.params.rideId) {
      props.history.push("/");
    }
  }
  public render() {
    // rideId 가 이상하게 string 으로 넘어옴
    // const { match: { params: { rideId } } } = this.props;
    const rideId = Number(this.props.match.params.rideId);
    
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <RideQuery query={GET_RIDE} variables={{ rideId }}>
            {({ data, loading, subscribeToMore }) => {
              const subscribeOptions: SubscribeToMoreOptions = {
                document: RIDE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  // status 가 FINISHED 면 홈으로
                  const { data: { RideStatusSubscription: { status } } } = subscriptionData;
                  if (status === "FINISHED") {
                    // user.isTaken = false;
                    // user.save();
                    // const passenger: User = ride.passengerId;
                    // passenger.isRiding = false;
                    // passenger.save();
                    window.location.href = "/";
                  }
                }
              };
              subscribeToMore(subscribeOptions);

              return (
                <RideUpdate mutation={UPDATE_RIDE_STATUS}>
                  {updateRideFn => (
                    <RidePresenter
                      userData={userData}
                      loading={loading}
                      data={data}
                      updateRideFn={updateRideFn}
                    />
                  )}
                </RideUpdate>
              );
            }}
          </RideQuery>
        )}
      </ProfileQuery>
    );
  }
}
export default RideContainer;