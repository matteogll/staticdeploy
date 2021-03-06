import { IEntrypoint } from "@staticdeploy/core";
import StaticdeployClient from "@staticdeploy/sdk";
import React from "react";

import emphasizeString from "../../common/emphasizeString";
import EntrypointForm, {
    IEntrypointFormInstance
} from "../../components/EntrypointForm";
import BaseOperationModal from "../../components/OperationModal";

class OperationModal extends BaseOperationModal<IEntrypoint> {}

interface IProps {
    entrypoint: IEntrypoint;
    trigger: React.ReactNode;
    refetchEntrypointDetail: () => void;
}

export default class EntrypointEditOperationModal extends React.Component<
    IProps
> {
    form!: IEntrypointFormInstance;
    editEntrypoint = (staticdeploy: StaticdeployClient) => {
        if (!this.form.isValid()) {
            this.form.submit();
            throw new Error("Invalid form data");
        }
        const values = this.form!.getValues();
        return staticdeploy.entrypoints.update(this.props.entrypoint.id, {
            bundleId: values.bundleId,
            redirectTo: values.redirectTo,
            configuration: values.configuration
        });
    };
    refetchEntrypointDetail = () => this.props.refetchEntrypointDetail();
    render() {
        return (
            <OperationModal
                title={
                    <span>
                        {"Edit entrypoint "}
                        {emphasizeString(this.props.entrypoint.urlMatcher)}
                    </span>
                }
                operation={this.editEntrypoint}
                trigger={this.props.trigger}
                startOperationButtonText="Save"
                onAfterSuccessClose={this.refetchEntrypointDetail}
                successMessage="Entrypoint saved"
            >
                <EntrypointForm
                    isEditForm={true}
                    initialValues={this.props.entrypoint}
                    ref={form => (this.form = form!)}
                />
            </OperationModal>
        );
    }
}
