// Credit: react-color-picker (https://github.com/flurmbo/react-duration-picker).
// I needed to modify the functionality of the project, so I copied the code and tweaked it.

import React, { useState, useRef, useEffect, useCallback } from "react";
import './ScrollPicker.css';

function toTwoDigitString(number: number) {
  if (number && number < 10) {
    return `0${number}`;
  } else if (number && number >= 10) {
    return `${number}`;
  }
  return '00';
}

interface RequiredProps {
  onChange: Function;
  unit: 'hours' | 'mins' | 'secs';
  isSmallScreen: boolean;
  cellHeight: number;
  initial: number;
}

type ConditionalProps =
  | {
  unit: 'hours';
  maxHours: number;
}
  | {
  unit: 'mins' | 'secs';
  maxHours?: never;
};

type Props = RequiredProps & ConditionalProps;
/*
DurationPickerColumn.defaultProps = {
  isSmallScreen: undefined,
  maxHours: 10,
  cellHeight: 35,
  initial: 0,
};
 */

function ScrollPicker(props: Props) {
  // ********* STATE VARIABLES, PROPS, REFS ********* //
  const { onChange, unit, maxHours, cellHeight } = props;
  const [columnIsFocused, setColumnIsFocused] = useState(false);
  const columnIsFocusedRef = useRef(false);
  const numCells = unit === "hours" ? maxHours + 1 : 60;
  const [offsetState, setOffsetState] = useState(() => {
    const numbers = [];
    for (let i = 0; i < numCells; i++) {
      numbers.push(i);
    }
    return {
      offset: 0,
      cellContents: numbers,
      initialAlignmentHasHappened: false,
    };
  });

  const [lastClientY, setLastClientY] = useState(undefined);
  const lastClientYRef = useRef(undefined);
  const currentSelectionRef = useRef(0);
  const offsetStateRef = useRef(offsetState);
  const slideyRef = useRef(null);
  const containerRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(false);
  const [isTouchInProgress, setIsTouchInProgress] = useState(false);
  const isTouchInProgressRef = useRef(false);
  // ********* EVENT HANDLERS ********* //


  function startHandler(e: any) {
    e.preventDefault();
    if (e.touches) {
      setIsTouchInProgress(true);
    }
    setLastClientY(e.touches ? e.touches[0].clientY : e.clientY);
  }

  const moveHandler = useCallback((e: any) => {
    e.preventDefault();
    const position = e.touches ? e.touches[0].clientY : e.clientY;
    setOffsetState(prevOffsetState => {
      return {
        ...prevOffsetState,
        // @ts-ignore
        offset: prevOffsetState.offset + position - lastClientYRef.current,
      };
    });
    setLastClientY(position);
  }, []);

  const endHandler = useCallback((e: any) => {
    e.preventDefault();
    setIsTouchInProgress(false);
  }, []);

  const mouseDownHandler = useCallback((e: any) => {
    startHandler(e);
    setIsMouseDown(true);
  }, []);

  const mouseMoveHandler = useCallback(
    (e: any) => {
      if (isMouseDownRef.current) {
        moveHandler(e);
      }
    },
    [moveHandler]
  );

  const mouseUpHandler = useCallback(
    (e: any) => {
      setIsMouseDown(false);
      if (isMouseDownRef.current) {
        endHandler(e);
      }
    },
    [endHandler]
  );

  const alignOffsetToCell = useCallback(
    // @ts-ignore
    (cellIndex, isInitial) => {
      setOffsetState(prevOffsetState => {
        return {
          ...prevOffsetState,
          offset: -1 * (cellIndex - 1) * cellHeight,
          initialAlignmentHasHappened: isInitial
            ? true
            : prevOffsetState.initialAlignmentHasHappened,
        };
      });
    },
    [cellHeight]
  );

  const getCurrentSelectionIndex = useCallback(
    // @ts-ignore
    offset => {
      return Math.abs(Math.round(offset / cellHeight)) + 1;
    },
    [cellHeight]
  );

  const keyDownHandler = useCallback(
    (e: any) => {
      if (columnIsFocusedRef.current) {
        const { code } = e;
        if (code === "ArrowUp") {
          // @ts-ignore
          alignOffsetToCell(
            getCurrentSelectionIndex(offsetStateRef.current.offset) - 1
          );
        } else if (code === "ArrowDown") {
          // @ts-ignore
          alignOffsetToCell(
            getCurrentSelectionIndex(offsetStateRef.current.offset) + 1
          );
        }
      }
    },
    // @ts-ignore
    [alignOffsetToCell, getCurrentSelectionIndex]
  );

  const focusInHandler = useCallback(() => {
    setColumnIsFocused(true);
  }, []);

  const focusOutHandler = useCallback(() => {
    setColumnIsFocused(false);
  }, []);

  // ********* HELPER FUNCTIONS ********* //
  const getCurrentSelection = useCallback(
    // @ts-ignore
    (offset, numbers) => {
      return numbers[Math.abs(Math.round(offset / cellHeight)) + 1];
    },
    [cellHeight]
  );

  const calculateOffsetToColumnRatio = useCallback(() => {
    // @ts-ignore
    const slideyRect = slideyRef.current.getBoundingClientRect();
    // @ts-ignore
    const containerRect = containerRef.current.getBoundingClientRect();
    const middleOfContainer = (containerRect.bottom + containerRect.top) / 2;
    const middleOfVisibleSlideyBit = middleOfContainer - slideyRect.top;
    const slideyRectHeight = slideyRect.bottom - slideyRect.top;
    return middleOfVisibleSlideyBit / slideyRectHeight;
  }, []);

  const handleShuffleColumn = useCallback(
    // @ts-ignore
    newOffset => {
      const ratio = calculateOffsetToColumnRatio();
      if (ratio >= 0.75 || ratio <= 0.25) {
        setOffsetState(prevOffsetState => {
          // @ts-ignore
          const { bottom, top } = slideyRef.current.getBoundingClientRect();
          return {
            offset:
              newOffset +
              ((ratio >= 0.75 ? 1 : -1) * (bottom - top)) / 2 +
              (numCells % 2 === 1 ? (-1 * cellHeight) / 2 : 0), // extra bit when num cells is odd
            cellContents: [
              ...prevOffsetState.cellContents.slice(numCells / 2, numCells),
              ...prevOffsetState.cellContents.slice(0, numCells / 2),
            ],
            initialAlignmentHasHappened:
            prevOffsetState.initialAlignmentHasHappened,
          };
        });
      }
    },
    [numCells, cellHeight, calculateOffsetToColumnRatio]
  );

  // ********* EFFECTS ********* //

  useEffect(() => {
    // set up initial position configuration of slidey
    alignOffsetToCell(props.initial, true);

    // eslint-disable-next-line react/destructuring-assignment
  }, [alignOffsetToCell, props.initial]);

  useEffect(() => {
    // when offset config is changed, check if need to adjust slidey and update current selection
    offsetStateRef.current = offsetState;
    if (offsetState.initialAlignmentHasHappened) {
      handleShuffleColumn(offsetState.offset);
    }
    const currentSelection = getCurrentSelection(
      offsetState.offset,
      offsetState.cellContents
    );
    console.log(`currentSelection: ${currentSelection}, currentSelectionRef.current: ${currentSelectionRef.current}`);
    if (currentSelectionRef.current !== currentSelection) {
      currentSelectionRef.current = currentSelection;
      console.log(`calling onChange(${currentSelection})`);
      onChange(currentSelection);
    }
  }, [getCurrentSelection, handleShuffleColumn, offsetState, onChange]);

  useEffect(() => {
    lastClientYRef.current = lastClientY;
  }, [lastClientY]);

  useEffect(() => {
    if (!isTouchInProgress && isTouchInProgressRef.current) {
      const { offset } = offsetStateRef.current;
      const currentSelectionIndex = getCurrentSelectionIndex(offset);
      // @ts-ignore
      alignOffsetToCell(currentSelectionIndex);
    }
    isTouchInProgressRef.current = isTouchInProgress;
  }, [alignOffsetToCell, getCurrentSelectionIndex, isTouchInProgress]);

  useEffect(() => {
    if (!isMouseDown && isMouseDownRef.current) {
      const { offset } = offsetStateRef.current;
      const currentSelectionIndex = getCurrentSelectionIndex(offset);
      // @ts-ignore
      alignOffsetToCell(currentSelectionIndex);
    }
    isMouseDownRef.current = isMouseDown;
  }, [alignOffsetToCell, getCurrentSelectionIndex, isMouseDown]);

  // ********* MOUSE AND KEYBOARD EFFECTS ********* //

  useEffect(() => {}, [isMouseDown]);

  useEffect(() => {
    if (columnIsFocused !== columnIsFocusedRef.current) {
      columnIsFocusedRef.current = columnIsFocused;
    }
  }, [columnIsFocused]);

  useEffect(() => {
    // set up and teardown listeners for keyboard and mouse input
    const container = containerRef.current;
    // @ts-ignore
    container.addEventListener("focusin", focusInHandler);
    // @ts-ignore
    container.addEventListener("focusout", focusOutHandler);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    return () => {
      // @ts-ignore
      container.removeEventListener("focusin", focusInHandler);
      // @ts-ignore
      container.removeEventListener("focusout", focusOutHandler);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("mousemove", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [
    focusInHandler,
    focusOutHandler,
    keyDownHandler,
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
  ]);

  // ********* RENDER ********* //

  const cells = offsetState.cellContents.map(value => {
    return (
      <div className="rdp-cell" key={value}>
        {toTwoDigitString(value)}
      </div>
    );
  });
  return (
    <div
      onTouchMove={moveHandler}
      onTouchStart={startHandler}
      onTouchEnd={endHandler}
      onMouseDown={mouseDownHandler}
      ref={containerRef}
      role="slider"
      aria-valuemax={unit === "hours" ? maxHours : 60}
      aria-valuemin={0}
      aria-valuenow={currentSelectionRef.current}
      tabIndex={0}
    >
      <div className="rdp-masked-div">
        <hr className="rdp-reticule" style={{ top: cellHeight - 1 }} />
        <hr className="rdp-reticule" style={{ top: cellHeight * 2 - 1 }} />
        <div
          className="rdp-column"
          style={{ top: offsetState.offset || 0 }}
          ref={slideyRef}
        >
          {cells}
        </div>
      </div>
    </div>
  );
}

export default ScrollPicker;