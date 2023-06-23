import styled from '@emotion/styled';
import { Flex, Textarea } from '@mantine/core';
import { Comment, WorkDay } from '../../../typings/types';

const CommentContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  flex: column;
`;

const Comment = ({ comment }: { comment: Comment }) => {
  return (
    <CommentContainer>
      <Flex>testestest</Flex>
      <Flex>{comment.content}</Flex>
    </CommentContainer>
  );
};

const Comments = ({ data }: { data: WorkDay }) => {
  return (
    <div>
      <Textarea placeholder="Tresc komentarza..." label="Dodaj komentarz" withAsterisk />
      {data.comments?.length > 0 && data.comments.map((comment) => <Comment key={comment.id} comment={comment} />)}
    </div>
  );
};

export default Comments;
