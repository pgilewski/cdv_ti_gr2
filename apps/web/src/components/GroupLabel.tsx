import styled from '@emotion/styled';

const LabelPracownik = styled.div`
  color: green;
`;

const GroupLabel = (group: 'Pracownik' | 'Moderator' | 'Administrator') => {
  if (group === 'Pracownik') {
    return <LabelPracownik>{group}</LabelPracownik>;
  } else if (group === 'Moderator') {
    return <div>{group}</div>;
  } else if (group === 'Administrator') {
    return <div>{group}</div>;
  }
};
export default GroupLabel;
