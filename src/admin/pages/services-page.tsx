import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Wrench } from "lucide-react";
import { useForm } from "react-hook-form";

import { EmptyState } from "@/admin/components/empty-state";
import { SwitchField, TextareaField, TextField } from "@/admin/components/form-fields";
import { ITEM_FORM_ID, ItemFormDialog } from "@/admin/components/item-form-dialog";
import { ListItemCard } from "@/admin/components/list-item-card";
import { PageHeader } from "@/admin/components/page-header";
import { QueryState } from "@/admin/components/query-state";
import { Button } from "@/components/ui/button";
import { move } from "@/lib/array";
import { repairServiceInputSchema, type RepairService, type RepairServiceInput } from "@/schemas/content";
import {
  useCreateRepairService,
  useDeleteRepairService,
  useGetAllRepairServices,
  useIsReorderingRepairServices,
  useReorderRepairServices,
  useUpdateRepairService,
} from "@/services/repair-services";

const emptyService: RepairServiceInput = { symptom: "", solution: "", visible: true };

export default function ServicesPage() {
  const query = useGetAllRepairServices();
  const create = useCreateRepairService();
  const [creating, setCreating] = useState(false);

  const addButton = (
    <Button onClick={() => setCreating(true)}>
      <Plus />
      إضافة خدمة
    </Button>
  );

  return (
    <>
      <PageHeader
        title="الخدمات"
        description="كل خدمة مكتوبة زي ما الزبون بيوصف المشكلة، وتحتها إنتو بتعملوا إيه."
        actions={addButton}
      />

      <QueryState query={query}>
        {(services) =>
          services.length === 0 ? (
            <EmptyState icon={Wrench} title="لسه مفيش خدمات" action={addButton} />
          ) : (
            <ul className="grid gap-3">
              {services.map((service, index) => (
                <ServiceRow key={service.id} service={service} index={index} services={services} />
              ))}
            </ul>
          )
        }
      </QueryState>

      <ItemFormDialog open={creating} onOpenChange={setCreating} title="إضافة خدمة" pending={create.isPending}>
        <ServiceForm
          defaultValues={emptyService}
          onSubmit={(values) => create.mutate(values, { onSuccess: () => setCreating(false) })}
        />
      </ItemFormDialog>
    </>
  );
}

type ServiceRowProps = { service: RepairService; index: number; services: RepairService[] };

function ServiceRow({ service: { id, ...service }, index, services }: ServiceRowProps) {
  const update = useUpdateRepairService(id);
  const remove = useDeleteRepairService(id);
  const reorder = useReorderRepairServices();
  const reordering = useIsReorderingRepairServices();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <ListItemCard
        index={index}
        total={services.length}
        onMove={(to) => reorder.mutate(move(services, index, to).map((item) => item.id))}
        visible={service.visible}
        onVisibleChange={(visible) => update.mutate({ visible })}
        onEdit={() => setEditing(true)}
        onDelete={() => remove.mutate()}
        deleteTitle={`تمسح خدمة «${service.symptom}»؟`}
        busy={update.isPending || remove.isPending}
        moveLocked={reordering}
      >
        <p className="font-semibold">{service.symptom}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{service.solution}</p>
      </ListItemCard>

      <ItemFormDialog open={editing} onOpenChange={setEditing} title="تعديل الخدمة" pending={update.isPending}>
        <ServiceForm
          defaultValues={service}
          onSubmit={(values) => update.mutate(values, { onSuccess: () => setEditing(false) })}
        />
      </ItemFormDialog>
    </>
  );
}

type ServiceFormProps = {
  defaultValues: RepairServiceInput;
  onSubmit: (values: RepairServiceInput) => void;
};

function ServiceForm({ defaultValues, onSubmit }: ServiceFormProps) {
  const form = useForm<RepairServiceInput>({ resolver: zodResolver(repairServiceInputSchema), defaultValues });
  const { control } = form;

  return (
    <form id={ITEM_FORM_ID} noValidate onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <TextField control={control} name="symptom" label="المشكلة" description="مثال: العربية بتسخن" autoFocus />
      <TextareaField control={control} name="solution" label="بنعمل إيه" counter={300} />
      <SwitchField control={control} name="visible" label="تظهر في الصفحة" />
    </form>
  );
}
