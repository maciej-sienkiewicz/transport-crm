// src/features/routes/components/RouteMapModal/components/StopNumberEditor/StopNumberEditor.tsx
import React, { useEffect, useRef } from 'react';
import {
    EditorOverlay,
    EditorContainer,
    EditorTitle,
    EditorSubtitle,
    EditorInputGroup,
    EditorLabel,
    EditorInput,
    EditorHint,
    EditorButtons,
    EditorButton,
} from './StopNumberEditor.styles';
import { StopNumberEditorState } from '../../utils/types';

interface StopNumberEditorProps {
    editorState: StopNumberEditorState;
    maxOrder: number;
    onConfirm: () => void;
    onCancel: () => void;
    onUpdateValue: (value: string) => void;
}

export const StopNumberEditor: React.FC<StopNumberEditorProps> = ({
                                                                      editorState,
                                                                      maxOrder,
                                                                      onConfirm,
                                                                      onCancel,
                                                                      onUpdateValue,
                                                                  }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editorState.isOpen) {
            console.log('📝 Editor opened:', editorState);
            // Fokus na input po otwarciu
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            }, 100);
        }
    }, [editorState.isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('⌨️ Enter pressed, calling onConfirm');
            onConfirm();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            console.log('⌨️ Escape pressed, calling onCancel');
            onCancel();
        }
    };

    const handleConfirmClick = () => {
        console.log('🖱️ Confirm button clicked');
        onConfirm();
    };

    if (!editorState.isOpen || !editorState.position || !editorState.point) {
        return null;
    }

    const newOrderNumber = parseInt(editorState.newOrder, 10);
    const isValid = !isNaN(newOrderNumber) && newOrderNumber >= 1 && newOrderNumber <= maxOrder;

    console.log('🔍 Editor render:', {
        newOrder: editorState.newOrder,
        newOrderNumber,
        isValid,
        maxOrder,
    });

    return (
        <>
            <EditorOverlay onClick={onCancel} />
            <EditorContainer
                $x={editorState.position.x}
                $y={editorState.position.y}
                onClick={(e) => e.stopPropagation()}
            >
                <EditorTitle>Zmień kolejność stopu</EditorTitle>
                <EditorSubtitle>
                    {editorState.point.childName} - {editorState.point.type === 'pickup' ? 'Odbiór' : 'Dowóz'}
                </EditorSubtitle>

                <EditorInputGroup>
                    <EditorLabel>
                        Nowa pozycja (obecnie: {editorState.currentOrder})
                    </EditorLabel>
                    <EditorInput
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={editorState.newOrder}
                        onChange={(e) => onUpdateValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="1"
                    />
                    <EditorHint>
                        Wpisz liczbę od 1 do {maxOrder}
                    </EditorHint>
                </EditorInputGroup>

                <EditorButtons>
                    <EditorButton onClick={onCancel}>
                        Anuluj
                    </EditorButton>
                    <EditorButton
                        $variant="primary"
                        onClick={handleConfirmClick}
                        disabled={!isValid}
                    >
                        Zatwierdź
                    </EditorButton>
                </EditorButtons>
            </EditorContainer>
        </>
    );
};