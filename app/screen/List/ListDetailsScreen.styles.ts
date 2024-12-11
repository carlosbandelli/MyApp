import styled from 'styled-components/native';
import { Surface, DataTable, Text } from 'react-native-paper';

export const Container = styled(Surface)`
  flex: 1;
  background-color: #7048d1;
`;

export const CenteredContainer = styled(Surface)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const ContentContainer = styled(Surface)`
  padding: 16px;
`;

export const Title = styled(Text)`
  margin-bottom: 8px;
`;

export const TotalValue = styled(Text)`
  margin-bottom: 16px;
`;

export const StyledDataTable = styled(DataTable)`
  background-color: white;
  elevation: 2;
  border-radius: 8px;
`;

export const ActionsColumn = styled(DataTable.Cell)`
  flex-direction: row;
  align-items: center;
`;

export const StyledTotalValue = styled.Text<{ totalValue: number | undefined }>`
  margin-bottom: 16px;
  color: ${(props) => {
    if (props.totalValue !== undefined && props.totalValue >= 100) {
      return '#63A002';
    } else if (props.totalValue !== undefined && props.totalValue >= 40) {
      return '#FFDE3F';
    } else if (props.totalValue !== undefined && props.totalValue >= 1) {
      return '#769CDF';
    } else {
      return '#FF5449';
    }
  }};
  font-weight: bold 800;
  font-size: 18px;
`;
