import React from 'react';
import { MutationFn } from 'react-apollo';
import Helmet from 'react-helmet';
import Sidebar from 'react-sidebar';
import AddressBar from '../../Components/AddressBar';
import Button from '../../Components/Button';
import Menu from '../../Components/Menu';
import RidePopUp from '../../Components/RidePopUp';
import styled from '../../typed-components';
import { getRides, userProfile } from '../../types/api';

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 250px;
`;

interface IProps {
  loading: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  mapRef: any;
  toAddress: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  price?: string;
  data?: userProfile;
  onAddressSubmit: () => void;
  requestRideFn?: MutationFn;
  nearbyRide?: getRides;
  acceptRideFn?: MutationFn;
}

const HomePresenter: React.SFC<IProps> = ({
  loading,
  isMenuOpen,
  toggleMenu,
  mapRef,
  toAddress,
  onInputChange,
  price,
  data: { GetMyProfile: { user = null } = {} } = {},
  onAddressSubmit,
  requestRideFn,
  nearbyRide: { GetNearbyRide: { ride = null } = {} } = {},
  acceptRideFn
}) => (
  <Container>
    <Helmet>
      <title>Home | WithCar</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          backgroundColor: "white",
          width: "80%",
          zIndex: "10"
        }
      }}
    >
      {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
      {user && !user.isDriving && (
          <React.Fragment>
            <AddressBar
              name={"toAddress"}
              onChange={onInputChange}
              value={toAddress}
              onBlur={null}
            />
            <ExtendedButton
              onClick={onAddressSubmit}
              disabled={toAddress === ""}
              value={price ? "도착지 바꾸기" : "도착지 선택하기"}
            />
          </React.Fragment>
        )}
      {price && (
        <RequestButton
          onClick={requestRideFn}
          // 주소에 아무것도 안적으면 요청이 되지 않음
          disabled={toAddress === ""}
          value={`요청할 금액은 ${price}원`}
        />
      )}

      {/* ride 라는 값이 존재할 때 생기는 창..? */}
      {ride && (
        <RidePopUp
          id={ride.id}
          pickUpAddress={ride.pickUpAddress}
          dropOffAddress={ride.dropOffAddress}
          price={ride.price}
          distance={ride.distance}
          passengerName={ride.passenger.fullName!}
          passengerPhoto={ride.passenger.profilePhoto!}
          acceptRideFn={acceptRideFn}
        />
      )}
      <Map ref={mapRef} />
    </Sidebar>
  </Container>
);

export default HomePresenter;