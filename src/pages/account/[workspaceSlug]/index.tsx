import ContentContainer from '../../../components/Content/ContentContainer';
import ContentDivider from '../../../components/Content/ContentDivider';
import ContentTitle from '../../../components/Content/ContentTitle';
import Meta from '../../../components/Meta/index';
import { AccountLayout } from '../../../layouts/index';
import { useWorkspace } from '../../../providers/workspace';

const Workspace = () => {
  const { workspace } = useWorkspace();

  return (
    workspace && (
      <AccountLayout>
        <Meta title={`Nextacular - ${workspace.name} | Dashboard`} />
        <ContentTitle
          title={workspace.name}
          subtitle="This is your project's workspace"
        />
        <ContentDivider />
        <ContentContainer />
      </AccountLayout>
    )
  );
};

export default Workspace;
