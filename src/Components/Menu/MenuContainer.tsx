import React from "react";
import { Mutation, Query } from "react-apollo";
import { toast } from "react-toastify";
import { USER_PROFILE } from "../../sharedQueries";
import { toggleDriving, userProfile } from "../../types/api";
import MenuPresenter from "./MenuPresenter";
import { TOGGLE_DRIVING } from "./MenuQueries";

class ProfileQuery extends Query<userProfile> {}
class ToggleDrivingMutation extends Mutation<toggleDriving> {}

class MenuContainer extends React.Component {
  public render() {
    return (
      <ToggleDrivingMutation
        mutation={TOGGLE_DRIVING}
        // cache 에 update 하기 위한
        update={(cache, { data }) => {
          if (data) {
            // data 안에 있는 ToggleDrivingMode 를 언급
            const { ToggleDrivingMode } = data;
            // ok 가 없다면 에러 표시
            if (!ToggleDrivingMode.ok) {
              console.log('ToggleDrivingMode.error');
              toast.error(ToggleDrivingMode.error);
              return;
            }
            // 정상적이라면 아래 진행
            const query: userProfile | null = cache.readQuery({ query: USER_PROFILE });
            if (query) {
              // query 안에 GetMyProfile 안에 user 가 있다.
              const { GetMyProfile: { user } } = query;
              if (user) {
                window.location.href = "/";
                // user.isDriving = !user.isDriving;
              }
            }
            cache.writeQuery({ query: USER_PROFILE, data: query });
          }
        }}
      > 
        {toggleDrivingFn => (
          <ProfileQuery query={USER_PROFILE}>
            {({ data, loading }) => (
              <MenuPresenter
                data={data}
                loading={loading}
                toggleDrivingFn={toggleDrivingFn}
              />
            )}
          </ProfileQuery>
        )}
      </ToggleDrivingMutation>
    );
  }
}

export default MenuContainer;