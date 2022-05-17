import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { useRouter } from "next/router";
import { BoringScaffold } from "@grida.co/app/boring-scaffold";
import { PublishPostReviewDialogBody } from "../dialogs";
import { PostsClient } from "../api";
import { BoringDocumentsStore } from "@boring.so/store";
import { BoringContent, BoringTitle } from "@boring.so/document-model";
import type { OnContentChange } from "@boringso/react-core";
import { Appbar, RightActionBar } from "../components/app-bar";
import type { Post, Publication, PublicationHost } from "../types";
import { PostsAppThemeProvider } from "../theme";
import type { Theme as PostCmsAppTheme } from "../theme";
import styled from "@emotion/styled";
import UrlPattern from "url-pattern";

const store = new BoringDocumentsStore();

type PostEditPageProps = { id: string } | { draft: true };

export default function PostEditPage({
  id,
  publication,
  theme,
}: {
  id: string;
  publication: Publication;
  theme?: PostCmsAppTheme;
}) {
  const router = useRouter();
  const [publishDialog, setPublishDialog] = React.useState(false); // controls review dialog

  const client = new PostsClient("627c481391a5de075f80a177");
  const [data, setData] = useState<Post>();
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState<"saving" | "saved" | "error">(undefined);
  const { hosts } = publication;
  const primaryHost = hosts?.[0];

  useEffect(() => {
    client.get(id).then((post) => {
      setData(post);
      setLoaded(true);
    });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    // load from store
    store.get(id).then((doc) => {
      if (doc) {
        setData({
          id,
          ...doc,
          title: doc.title.raw,
          body: doc.content.raw,
          isDraft: true,
        });
      }
    });
  }, [id]);

  useEffect(() => {
    if (!data) return;

    store.put({
      id: id,
      title: new BoringTitle(data.title),
      content: data.body.html
        ? new BoringContent(data.body.html)
        : new BoringContent(""),
    });
  }, [data]);

  const onTitleChange = debounce((t) => {
    setSaving("saving");
    setData((d) => ({ ...d, title: t }));
    client
      .updateTitle(id, t)
      .then(() => {
        setSaving("saved");
      })
      .catch((e) => {
        setSaving("error");
      });
  }, 1000);

  const onContentChange = debounce((t) => {
    setSaving("saving");
    setData((d) => ({ ...d, body: { html: t } }));
    client
      .updateBody(id, t)
      .then(() => {
        setSaving("saved");
      })
      .catch((e) => {
        setSaving("error");
      });
  }, 3000);

  const onSummaryChange = debounce((t) => {
    setSaving("saving");
    setData((d) => ({ ...d, summary: t }));
    client
      .updateSummary(id, { summary: t })
      .then(() => {
        setSaving("saved");
      })
      .catch((e) => {
        setSaving("error");
      });
  }, 1000);

  const onUploadImage = async (d): Promise<string | false> => {
    console.log("have to upload this resouce", d);

    // return "https://wallpaperaccess.com/full/366398.jpg";
    return "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/5eeea355389655.59822ff824b72.gif";
    // return "https://grida.co/";
  };

  const canPublish: boolean =
    data && !!data.title.length && !!data.body.html?.length;

  return (
    <PostsAppThemeProvider theme={theme}>
      <Dialog
        maxWidth="xl"
        open={publishDialog}
        onClose={() => {
          setPublishDialog(false);
        }}
      >
        {data && (
          <PublishPostReviewDialogBody
            title={data.title}
            summary={data.summary}
            tags={data.tags}
            onPublish={(p) => {
              // 1. update with value (TODO:)
              client.publish(id).then(({ id }) => {
                // 2. then => publish
                setPublishDialog(false);
                if (primaryHost) {
                  open(buildTargetUrl(primaryHost, { ...data }, false));
                }
              });
            }}
            onTitleChange={onTitleChange}
            onSummaryChange={onSummaryChange}
            onSchedule={(p) => {
              // TODO:
              // 1. update with value
              // 2. them => schedule
              setPublishDialog(false);
            }}
            onCancel={() => {
              setPublishDialog(false);
            }}
            onTagsEdit={(tags: string[]) => {
              // TODO:
            }}
            publication={{
              name: "Grida",
            }}
          />
        )}
      </Dialog>
      <Appbar
        logo={
          publication.logo ? <LogoContainer src={publication.logo} /> : null
        }
        onLogoClick={() => {
          router.push("/posts");
        }}
        mode={data?.postedAt ? "update" : "post"}
        saving={saving}
        disabledPublish={!canPublish}
        onPreviewClick={() => {
          open(buildTargetUrl(primaryHost, { ...data }, true));
        }}
        onPublishClick={() => {
          setPublishDialog(true);
        }}
      />
      <EditorContainer>
        <Editor
          id={id}
          fileUploader={onUploadImage}
          store={store}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
          readonly={!loaded}
          theme={theme?.app_posts_cms?.editor}
        />
      </EditorContainer>
    </PostsAppThemeProvider>
  );
}

const LogoContainer = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

const EditorContainer = styled.div`
  margin: 80px 120px 100px;
  border-radius: 8px;
  box-shadow: 0px 4px 24px 4px rgba(0, 0, 0, 0.04);
  background-color: ${(props) =>
    /* @ts-ignore */
    props.theme.app_posts_cms.colors.root_background};

  @media (max-width: 1080px) {
    margin: 80px 40px 100px;
  }
  @media (max-width: 768px) {
    margin: 80px 20px 80px;
  }
`;

function buildTargetUrl(
  host: PublicationHost,
  params: { [key: string]: any },
  preview?: boolean
) {
  const { homepage, pattern } = host;
  const url = new URL(homepage + new UrlPattern(pattern, {}).stringify(params));

  // add preview?=true if needed
  if (preview) {
    url.searchParams.set("preview", "true");
  }

  return url.toString();
}

function Editor({
  id,
  store,
  onTitleChange,
  onContentChange,
  readonly,
  fileUploader,
  theme,
}: {
  id: string;
  store;
  onContentChange: OnContentChange;
  onTitleChange: (t: string) => void;
  readonly: boolean;
  fileUploader: (...d: File[]) => Promise<string | false>;
  theme?: PostCmsAppTheme["app_posts_cms"]["editor"];
}) {
  return (
    <BoringScaffold
      readonly={readonly}
      initial={id}
      onContentChange={onContentChange}
      onTitleChange={onTitleChange}
      titleStyle={{
        textAlign: theme.title_text_align,
      }}
      fileUploader={fileUploader}
    />
  );
}

function debounce(func, timeout = 2000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
