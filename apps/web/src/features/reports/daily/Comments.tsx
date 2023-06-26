import { useEffect, useState } from 'react';
import { Flex, Textarea, Button, Card, Select, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import styled from '@emotion/styled';

export enum CommentType {
  Warning = 'warning',
  Error = 'error',
  Ok = 'ok',
}

interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  type: CommentType;
  workdayId: number;
  workday: any; 
  userId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const CommentContainer = styled.div`
  max-width: 800px;
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

const SingleComment: React.FC<SingleCommentProps> = ({ comment, handleDeleteComment }) => {
  const getCommentTypeColor = (type: CommentType) => {
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

  const handleDelete = () => {
    handleDeleteComment(comment.id);
  };

  return (
    <CommentContainer>
      <Flex>
        <strong>{dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm')}</strong>
        <Badge color={getCommentTypeColor(comment.type)}>{comment.type}</Badge>
        <CommentAuthor style={{ marginLeft: '400px' }}>
          <small>
            Autor: {comment.user.firstName} {comment.user.lastName} ({comment.user.role})
          </small>
        </CommentAuthor>
      </Flex>
      <CommentContent color={getCommentTypeColor(comment.type)}>
        {comment.content}
      </CommentContent>
      <CommentButtonContainer>
        <Button size="xs" variant="outline" color="red" onClick={handleDelete}>
          Usuń
        </Button>
      </CommentButtonContainer>
    </CommentContainer>
  );
};

interface CommentsProps {
  data: any;
}

const Comments: React.FC<CommentsProps> = ({ data }) => {
  const [newComment, setNewComment] = useState<Comment>({
    id: 0,
    createdAt: '',
    updatedAt: '',
    content: '',
    type: CommentType.Ok,
    workdayId: 0,
    workday: {} as any,
    userId: 0,
    user: {
      id: 0,
      firstName: '',
      lastName: '',
      role: '',
    },
  });
  const [comments, setComments] = useState<Comment[]>(data.comments || []);

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment((prevComment) => ({ ...prevComment, content: event.target.value }));
  };

  const handleCommentTypeChange = (value: CommentType) => {
    setNewComment((prevComment) => ({ ...prevComment, type: value }));
  };

  const handleAddComment = () => {
    const newCommentWithDetails = {
      ...newComment,
      id: comments.length + 1,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
      workdayId: data.id,
      workday: data,
      userId: data.userId,
      user: data.user,
    };

    setComments((prevComments) => [...prevComments, newCommentWithDetails]);
    setNewComment({
      id: 0,
      createdAt: '',
      updatedAt: '',
      content: '',
      type: CommentType.Ok,
      workdayId: 0,
      workday: {} as any,
      userId: 0,
      user: {
        id: 0,
        firstName: '',
        lastName: '',
        role: '',
      },
    });
  };

  const handleDeleteComment = (id: number) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
  };

  useEffect(() => {
    setComments(data.comments || []);
  }, [data.comments]);

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
        <Select<CommentType>
          data={[
            { label: 'Warning', value: CommentType.Warning },
            { label: 'Error', value: CommentType.Error },
            { label: 'OK', value: CommentType.Ok },
          ]}
          value={newComment.type}
          onChange={(value) => handleCommentTypeChange(value)}
          itemLabel={(item) => item.label}
          itemValue={(item) => item.value}
          size="sm"
          style={{ marginRight: '10px' }}
        />
        <Button size="sm" variant="outline" onClick={handleAddComment}>
          Dodaj komentarz
        </Button>
      </Flex>
      {comments.length > 0 && (
        <Card shadow="xs" padding="md" marginTop="md">
          <strong>Komentarze:</strong>
          {comments.map((comment) => (
            <SingleComment key={comment.id} comment={comment} handleDeleteComment={handleDeleteComment} />
          ))}
        </Card>
      )}
    </div>
  );
};

export default Comments;
