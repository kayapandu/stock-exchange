import React, {memo} from 'react';
import { Text, Pressable} from 'react-native';

import { COLOR } from '@constants/constants';

const FilterComponent = ({
  filterDay,
  filterText,
  selectedRange,
  setSelectedRange,
}) => {
  const isFilterSelected = filter => filter === selectedRange;

  return (
    <Pressable
      style={{
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: isFilterSelected(filterDay)
          ? COLOR.brightCyan
          : 'transparent',
      }}
      onPress={() => setSelectedRange(filterDay)}>
      <Text style={{color: isFilterSelected(filterDay) ? COLOR.black : COLOR.gray}}>
        {filterText}
      </Text>
    </Pressable>
  );
};

export default memo(FilterComponent);
