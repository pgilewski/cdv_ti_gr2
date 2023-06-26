import { useContext, useEffect, useState } from 'react';
import { Flex, Textarea, Button, Card, Select, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { Comment, WorkDay } from '../../../typings/types';
import useCommentsManagement from '../../../hooks/useCommentsManagement';
import { NotyfContext } from '../../../hooks/useNotyf';
import { useQueryClient } from 'react-query';

export enum CommentType {
  Warning = 'warning',
  Error = 'error',
  Ok = 'ok',
}

const CommentContainer = styled.div`
  margin: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CommentContent = styled(Flex)`
  flex-grow: 1;
  color: ${({ color }: { color: string }) => color};
`;

const CommentButtonContainer = styled(Flex)`
  justify-content: flex-end;
  margin-top: 10px;
`;

const CommentAuthor = styled.div`
  align-self: flex-end;
  margin-bottom: 5px;
`;

interface SingleCommentProps {
  comment: Comment;
  handleDeleteComment: (id: number) => void;
}

const SingleComment = ({ comment, handleDeleteComment }: SingleCommentProps) => {
  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case CommentType.Warning:
        return 'orange';
      case CommentType.Error:
        return 'red';
      case CommentType.Ok:
        return 'green';
      default:
        return 'gray';
    }
  };

  const handleDelete = (commentId: number) => {
    console.log(commentId);
    handleDeleteComment(commentId);
  };

  return (
    <CommentContainer>
      <Flex justify={'space-between'}>
        <div>
          <strong>{dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm')}</strong>
          <Badge color={getCommentTypeColor(comment.type)} ml={'sm'}>
            {comment.type}
          </Badge>
        </div>
        <CommentAuthor style={{ marginLeft: '400px' }}>
          <small>
            Autor: {comment.user?.firstName} {comment.user?.lastName} ({comment.user?.role})
          </small>
        </CommentAuthor>
      </Flex>
      <CommentContent color={getCommentTypeColor(comment.type)}>{comment.content}</CommentContent>
      <CommentButtonContainer>
        <Button size="xs" variant="outline" color="red" onClick={() => handleDelete(comment.id)}>
          Usuń
        </Button>
      </CommentButtonContainer>
    </CommentContainer>
  );
};

interface CommentsProps {
  data: WorkDay;
}

const Comments = ({ data }: CommentsProps) => {
  const { createCommentMutation, deleteCommentMutation } = useCommentsManagement();
  const notyf = useContext(NotyfContext);
  const queryClient = useQueryClient();
  const defaultCommentState = {
    id: 0,
    createdAt: '',
    updatedAt: '',
    content: '',
    type: CommentType.Ok,
    workDayId: data.id,
    userId: data.userId,
  };

  const [newComment, setNewComment] = useState<Comment>(defaultCommentState);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment((prevComment) => ({ ...prevComment, content: event.target.value }));
  };

  const handleCommentTypeChange = (value: CommentType) => {
    setNewComment((prevComment) => ({ ...prevComment, type: value }));
  };

  const handleAddComment = () => {
    const newCommentWithDetails = {
      content: newComment.content,
      type: newComment.type,
      workDayId: data.id,
      userId: data.userId,
    };

    try {
      createCommentMutation.mutate(newCommentWithDetails, {
        onSuccess: () => {
          notyf.success('Comment created successfully!');
          queryClient.invalidateQueries(['workDay', data.userId, data.id]);
        },
        onError: (error) => {
          notyf.error('An error occurred while creating the comment!');
        },
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }

    setNewComment({
      id: 0,
      createdAt: '',
      updatedAt: '',
      content: '',
      type: CommentType.Ok,
      workDayId: 0,
      workDay: {} as any,
      userId: 0,
    });
  };

  const handleDeleteComment = (id: number) => {
    // setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));

    try {
      deleteCommentMutation.mutate(id, {
        onSuccess: () => {
          notyf.success('Comment deleted successfully!');
          queryClient.invalidateQueries(['workDay', data.userId, data.id]);
        },
        onError: (error) => {
          notyf.error('An error occurred while deleting the comment!');
        },
      });
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <div>
      <Textarea
        placeholder="Treść komentarza..."
        label="Dodaj komentarz"
        withAsterisk
        value={newComment.content}
        onChange={handleCommentChange}
      />
      <Flex justify="center" align="center" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Select
          data={[
            { label: 'Warning', value: CommentType.Warning },
            { label: 'Error', value: CommentType.Error },
            { label: 'OK', value: CommentType.Ok },
          ]}
          value={newComment.type}
          onChange={(value: CommentType) => handleCommentTypeChange(value)}
          size="sm"
          style={{ marginRight: '10px' }}
        />
        <Button size="sm" variant="outline" onClick={handleAddComment}>
          Dodaj komentarz
        </Button>
      </Flex>
      {data.comments.length > 0 && (
        <Card shadow="xs" padding="md" mt="md">
          <strong>Komentarze:</strong>
          {data.comments.map((comment) => (
            <SingleComment key={comment.id} comment={comment} handleDeleteComment={handleDeleteComment} />
          ))}
        </Card>
      )}
    </div>
  );
};

export default Comments;
